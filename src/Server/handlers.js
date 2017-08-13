function getImageMap(mapService) {
  return async (req, res) => {
    const image = await mapService.getImageMap({
      center: [19.0779332, 50.2389625],
    });
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
