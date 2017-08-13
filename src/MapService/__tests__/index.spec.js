const MapService = require('../index');
const config = require('../../config');

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
          center: [19.0779332, 50.2389625],
          zoom: 8,
          width: 100,
          height: 100,
        },
        {
          center: [19.0779332, 50.2389625],
          zoom: 5,
          width: 20,
          height: 20,
        },
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
