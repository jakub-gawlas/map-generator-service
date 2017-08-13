const MapService = require('./MapService');
const Server = require('./Server');
const config = require('./config');
const winston = require('winston');

(async () => {
  const mapService = new MapService();
  try {
    await mapService.init();
  } catch (err) {
    winston.error('while initialize MapService', err);
  }

  const server = new Server(config, mapService);
  try {
    await server.run();
  } catch (err) {
    winston.error('while start server', err);
  }
})();
