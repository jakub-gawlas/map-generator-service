const chromeLauncher = require('chrome-launcher');
const chromeRemoteInterface = require('chrome-remote-interface');
const express = require('express');
const path = require('path');
const winston = require('winston');

const startWebApp = Symbol();

class MapService {
  constructor(config) {
    this.config = config;
    this.headless = null;
  }
  /**
   * Initialize headless and navigate to web application
   */
  init() {
    return new Promise(async (resolve, reject) => {
      try {
        await this[startWebApp]();
      } catch (err) {
        winston.error(err);
        throw new Error('while start web application');
      }
      const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless'],
      });
      this.headless = await chromeRemoteInterface({
        port: chrome.port,
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
      app.listen(8080, resolve);
    });
  }
  /**
   * Return image of map as base64 png
   * @param {object} options:
   *  center {array}: center of map, in format [lng, lat], required
   *  zoom {number}: zoom of map, default 5
   *  width {number}: width of result image, default 400
   *  height {number}: height of result image, default 400
   */
  async getImageMap({ center, zoom = 5, width = 400, height = 400 } = {}) {
    if (!center) throw new Error('Required options parameter `center`');

    // Script to run getMap function from web-app/script.js
    const getMapScript = `getMap({ 
      center: [${center[0]}, ${center[1]}], 
      zoom: ${zoom}, 
      width: ${width}, 
      height: ${height} 
    });`;

    const { Runtime } = this.headless;
    const image = await Runtime.evaluate({
      expression: getMapScript,
      awaitPromise: true,
    });
    const imageDataURL = image.result.value;
    if (!image.result.value) throw new Error('Map cannot be generated');
    const imageBase64 = imageDataURL.replace(/^data:image\/\w+;base64,/, '');
    return imageBase64;
  }
}

module.exports = MapService;
