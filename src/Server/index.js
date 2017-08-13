const express = require('express');
const cors = require('cors');
const winston = require('winston');
const handlers = require('./handlers');

const MODULE = 'Server';

const initRouter = Symbol();

class Server {
  /**
   * 
   * @param {object} config 
   * @param {MapService} mapService
   */
  constructor(config, mapService) {
    this.config = config;
    this.mapService = mapService;
    this.app = null;
    this.server = null;
  }
  /**
   * Start server
   */
  run() {
    return new Promise((resolve, reject) => {
      this.app = express();
      this.app.use(cors());
      this[initRouter]();
      this.server = this.app.listen(this.config.APP_SERVER_PORT, () => {
        winston.info(
          MODULE,
          `started on 127.0.0.1:${this.config.APP_SERVER_PORT}`
        );
        resolve();
      });
    });
  }
  /**
   * Close server
   */
  shutdown() {
    winston.info(MODULE, 'start shutdown');
    this.server.close();
    winston.info(MODULE, 'finished shutdown');
  }
  /**
   * @private
   * Set handlers for routes
   * @param {object} app - express server instance
   */
  [initRouter]() {
    this.app
      .get('/image', handlers.getImageMap(this.mapService))
      .get('/checkup', (req, res) => res.end('ok'));
  }
}

module.exports = Server;
