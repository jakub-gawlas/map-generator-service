function getImageMap(mapService) {
  return async (req, res) => {
    const imageBase64 = await mapService.getImageMap({
      center: [19.0779332, 50.2389625],
    });
    const image = new Buffer(imageBase64, 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': image.length,
    });
    res.end(image);
  };
}

module.exports = {
  getImageMap,
};
