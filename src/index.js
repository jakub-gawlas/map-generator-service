const MapService = require('./MapService');
const Server = require('./Server');
const winston = require('winston');

(async () => {

  // Config
  let config;
  try {
    config = require('./config');
  } catch (err) {
    winston.error('while load config', err);
    process.exit(1);
  }

  // MapService
  const mapService = new MapService(config);
  try {
    await mapService.run();
  } catch (err) {
    winston.error('while initialize MapService', err);
    process.exit(1);
  }

  // Server
  const server = new Server(config, mapService);
  try {
    await server.run();
  } catch (err) {
    winston.error('while start server', err);
    process.exit(1);
  }

  // Graceful shutdown
  function shutdown() {
    winston.info('Start graceful shutdown');
    mapService.shutdown();
    server.shutdown();
    winston.info('Finished graceful shutdown');
  }
  process.on('SIGTERM', shutdown).on('SIGINT', shutdown);

  // Catch unhandled rejections
  process.on('unhandledRejection', winston.error);
})();
