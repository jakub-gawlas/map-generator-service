const winston = require('winston');

function validator(req, res, next) {
  if (!req.query.data) {
    res.status(400);
    res.json({
      error: 'Required query parameter `data`',
    });
    return;
  }

  let data;
  try {
    data = JSON.parse(req.query.data);
  } catch (err) {
    res.status(400);
    res.json({
      error: 'Bad format of query paramater `data`. Required JSON format.',
    });
    return;
  }
  req.query.data = data;
  next();
}

function handler(mapService) {
  return async (req, res) => {
    let image;
    try {
      image = await mapService.getImageMap({
        data: req.query.data,
      });
    } catch (err) {
      winston.error('while handle request', err);
      res.status(400);
      res.json({
        error: 'Bad format of GeoJSON',
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
  validator,
  handler,
};
