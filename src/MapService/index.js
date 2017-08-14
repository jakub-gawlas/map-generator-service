const chromeLauncher = require('chrome-launcher');
const chromeRemoteInterface = require('chrome-remote-interface');
const express = require('express');
const path = require('path');
const winston = require('winston');
const utils = require('./utils');

const MODULE = 'MapService';

const startWebApp = Symbol();

class MapService {
  constructor(config) {
    this.config = config;
    this.chrome = null;
    this.headless = null;
    this.webappServer = null;
  }
  /**
   * Run headless chromium, navigate to web application
   */
  run() {
    return new Promise(async (resolve, reject) => {
      try {
        await this[startWebApp]();
      } catch (err) {
        winston.error(err);
        throw new Error('Cannot start web application');
      }
      this.chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless'],
      });
      this.headless = await chromeRemoteInterface({
        port: this.chrome.port,
      });
      const { Page, Runtime } = this.headless;
      await Promise.all([Page.enable(), Runtime.enable()]);
      Page.navigate({ url: 'http://127.0.0.1:8080' });
      Page.loadEventFired(async () => {
        const setMapboxTokenScript = `
          mapboxgl.accessToken = '${this.config.APP_MAP_SERVICE_MAPBOX_TOKEN}'
        `;
        await Runtime.evaluate({
          expression: setMapboxTokenScript,
        });
        resolve();
      });
    });
  }
  /**
   * @private
   * Start web application to generate maps
   */
  [startWebApp]() {
    return new Promise((resolve, reject) => {
      const app = express();
      app.use('/', express.static(path.resolve(__dirname, 'web-app')));
      this.webappServer = app.listen(8080, resolve);
    });
  }
  /**
   * Close connection to headless
   */
  async shutdown() {
    winston.info(MODULE, 'start shutdown');
    await this.headless.close();
    await this.chrome.kill();
    this.webappServer.close();
    this.headless = null;
    this.chrome = null;
    this.webappServer = null;
    winston.info(MODULE, 'finished shutdown');
  }
  /**
   * Return image of map as image/png buffer
   * @param {object} options:
   *  data {object}: geojson, required
   *  width {number}: width of result image, optional
   *  height {number}: height of result image, optional
   */
  async getImageMap(
    {
      data,
      width,
      height,
    } = {}
  ) {
    if(!data) throw new Error('Required parameter `data`');
    const maxBounds = utils.getMaxBounds(data);
    if(!maxBounds) throw new Error('Bad format of `data`. Required GeoJSON format.');
    const enlargedMaxBounds = utils.enlargeBounds(maxBounds, 0.3);
    const source = data ? { type: 'geojson', data } : null;

    // Script to run getMap function from web-app/script.js
    const getMapScript = `getMap({
      source: ${JSON.stringify(source)},
      maxBounds: ${JSON.stringify(enlargedMaxBounds)},
      width: ${width}, 
      height: ${height} 
    });`;

    const { Runtime } = this.headless;
    const image = await Runtime.evaluate({
      expression: getMapScript,
      awaitPromise: true,
    });
    const imageDataURL = image.result.value;
    if (!image.result.value) throw new Error('Cannot render map');
    const imageBase64 = imageDataURL.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = new Buffer(imageBase64, 'base64');
    return imageBuffer;
  }
}

module.exports = MapService;
