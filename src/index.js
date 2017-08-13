const MapService = require('./MapService');
const fs = require('fs-extra');

(async () => {
  const mapService = new MapService();
  try {
    await mapService.init();
  } catch (err) {
    console.error('while initialize', err);
  }

  let imageBase64;
  try {
    imageBase64 = await mapService.getImageMap({
      center: [19.0779332, 50.2389625],
      zoom: 8,
    });
  } catch (err) {
    console.error('while get image map', err);
  }

  try {
    await fs.writeFile('map.png', imageBase64, 'base64');
  } catch (err) {
    console.error('while save image', err);
  }
})();
