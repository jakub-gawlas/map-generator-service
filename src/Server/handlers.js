const winston = require('winston');

function getImageMap(mapService) {
  return async (req, res) => {
    const lng = Number.parseFloat(req.query.lng);
    const lat = Number.parseFloat(req.query.lat);

    if (!lng || !lat) {
      res.status(400);
      res.json({
        error: 'Bad query parameters',
      });
      return;
    }

    let image;
    try {
      image = await mapService.getImageMap({
       center: [lng, lat],
     });
    }catch(err){
      winston.error('while handle request', req, err);
      res.status(400);
      res.json({
        error: 'Bad request',
      });
      return;
    }
    
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
