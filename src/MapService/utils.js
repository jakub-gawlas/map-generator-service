/**
 * Return max bounds in format [[minLng, minLat], [maxLng, maxLat]]
 * @param {object} geojson 
 */
function getMaxBounds(geojson) {
  if (
    !geojson ||
    geojson.type !== 'FeatureCollection' ||
    !geojson.features ||
    !Array.isArray(geojson.features) ||
    geojson.features.length === 0
  ) {
    return null;
  }
  const features = geojson.features;
  const coordinates = features
    .reduce((arr, f) => [...arr, ...f.geometry.coordinates], [])
    .reduce((arr, x) => [...arr, ...x], []);
  const lngsLats = coordinates.reduce(
    (obj, c) => {
      obj.lngs.push(c[0]);
      obj.lats.push(c[1]);
      return obj;
    },
    { lngs: [], lats: [] }
  );
  return [
    [Math.min(...lngsLats.lngs), Math.min(...lngsLats.lats)],
    [Math.max(...lngsLats.lngs), Math.max(...lngsLats.lats)],
  ];
}

module.exports = {
  getMaxBounds,
};
