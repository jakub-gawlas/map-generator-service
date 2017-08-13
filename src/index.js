const MapService = require('./MapService');
const Server = require('./Server');
const config = require('./config');

(async () => {
  const mapService = new MapService();
  try {
    await mapService.init();
  } catch (err) {
    console.error('while initialize MapService', err);
  }

  const server = new Server(config, mapService);
  try {
    await server.run();
  } catch (err) {
    console.error('while start server', err);
  }
})();
