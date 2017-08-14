const MapService = require('../index');
const config = require('../../config');
const sampleGeoJSON = require('./sampleGeoJSON.json');

describe('MapService', () => {
  let mapService;
  it('should create instance', () => {
    mapService = new MapService(config);
    expect(mapService).toBeDefined();
  });
  it('should run', async () => {
    await mapService.run();
    expect(mapService.chrome).toBeDefined();
    expect(mapService.headless).toBeDefined();
    expect(mapService.webappServer).toBeDefined();
  });
  describe('method getImageMap', () => {
    describe('should works', () => {
      [
        {
          data: sampleGeoJSON
        }
      ].forEach((options, i) => {
        it(`case ${i}`, async () => {
          expect(await mapService.getImageMap(options)).toMatchSnapshot();
        });
      });
    });
  });
  it('should shutdown', async () => {
    await mapService.shutdown();
    expect(mapService.headless).toBeNull();
    expect(mapService.chrome).toBeNull();
    expect(mapService.webappServer).toBeNull();
  });
});
