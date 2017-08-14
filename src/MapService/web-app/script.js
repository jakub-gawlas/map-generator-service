/**
 * Return promise, resolved to map in format base64 png
 * @param {*} param0 
 */
function getMap({ data, maxBounds, center, zoom, width, height }) {
  return new Promise((resolve, reject) => {
    const mapId = Math.floor(Math.random() * 1000);
    const container = document.createElement('div');
    const map = new mapboxgl.Map({
      container: container,
      style: 'mapbox://styles/mapbox/streets-v9',
      attributionControl: false,
      preserveDrawingBuffer: true,
      center: maxBounds ? null : center,
      zoom: maxBounds ? null : zoom,
      maxBounds,
    });
    const canvas = map.getCanvas();
    if(width) canvas.setAttribute('width', width);
    if(height) canvas.setAttribute('height', height);
    map.on('load', () => {
      if (!data) {
        return resolve(canvas.toDataURL());
      }
      map.addSource('shapes', Object.assign(data, { type: 'geojson' }));
      map.addLayer({
        id: 'filled-shapes',
        type: 'fill',
        source: 'shapes',
        paint: {
          'fill-color': '#888888',
          'fill-opacity': 0.4,
        },
      });
      setTimeout(() => resolve(canvas.toDataURL()), 100);
    });
  });
}
