const express = require('express');
const cors = require('cors');
const winston = require('winston');
const handlers = require('./handlers');

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
  }
  /**
   * Start server
   */
  run() {
    return new Promise((resolve, reject) => {
      const app = express();
      app.use(cors());
      this[initRouter](app);
      app.listen(this.config.APP_SERVER_PORT, () => {
        winston.info(
          `Server started on 127.0.0.1:${this.config.APP_SERVER_PORT}`
        );
        resolve();
      });
    });
  }
  /**
   * @private
   * Set handlers for routes
   * @param {object} app - express server instance
   */
  [initRouter](app) {
    app.get('/image', handlers.getImageMap(this.mapService));
    app.get('/checkup', (req, res) => res.end('ok'));
  }
}

module.exports = Server;
