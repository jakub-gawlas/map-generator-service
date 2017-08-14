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

  if (req.query.width) {
    const width = Number.parseFloat(req.query.width);
    if (!width) {
      res.status(400);
      res.json({
        error: 'Bad format query parameter `width`. Required number.',
      });
      return;
    }
    req.query.width = width;
  }

  if (req.query.height) {
    const height = Number.parseFloat(req.query.height);
    if (!height) {
      res.status(400);
      res.json({
        error: 'Bad format query parameter `height`. Required number.',
      });
      return;
    }
    req.query.height = height;
  }

  next();
}

function handler(mapService) {
  return async (req, res) => {
    let image;
    try {
      image = await mapService.getImageMap({
        data: req.query.data,
        width: req.query.width,
        height: req.query.height,
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
