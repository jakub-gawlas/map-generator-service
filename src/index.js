const MapService = require('./MapService');
const Server = require('./Server');
const winston = require('winston');

(async () => {
  let config;
  try {
    config = require('./config');
  } catch (err) {
    winston.error('while load config', err);
    process.exit(1);
  }

  const mapService = new MapService(config);
  try {
    await mapService.init();
  } catch (err) {
    winston.error('while initialize MapService', err);
    process.exit(1);
  }

  const server = new Server(config, mapService);
  try {
    await server.run();
  } catch (err) {
    winston.error('while start server', err);
    process.exit(1);
  }
})();
