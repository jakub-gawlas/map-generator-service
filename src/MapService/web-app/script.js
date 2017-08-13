// Set MapBox token
mapboxgl.accessToken =
  'MAP_BOX_ACCESS_TOKEN';

/**
 * Return promise, resolved to map in format base64 png
 * @param {*} param0 
 */
function getMap({ center, zoom, width = 200, height = 200 }) {
  return new Promise((resolve, reject) => {
    const mapId = Math.floor(Math.random() * 1000);
    const container = document.createElement('div');
    const map = new mapboxgl.Map({
      container: container,
      style: 'mapbox://styles/mapbox/streets-v9',
      attributionControl: false,
      preserveDrawingBuffer: true,
      center,
      zoom,
    });
    const canvas = map.getCanvas();
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    map.on('load', () => {
      resolve(map.getCanvas().toDataURL());
    });
  });
}
