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

/**
 * Return enlarged bounds in format [[minLng, minLat], [maxLng, maxLat]]
 * @param {*} bounds - bounds to enlarge in format [[minLng, minLat], [maxLng, maxLat]]
 * @param {*} k - enlarge factor
 */
function enlargeBounds(bounds, k) {
  const distanceLngs = bounds[0][0] - bounds[1][0];
  const distanceLats = bounds[0][0] - bounds[1][0];
  const deltaLngs = Math.abs(distanceLngs * k);
  const deltaLats = Math.abs(distanceLats * k);
  return [
    [bounds[0][0] - deltaLngs, bounds[0][1] - deltaLats],
    [bounds[1][0] + deltaLngs, bounds[1][1] + deltaLats],
  ];
}

module.exports = {
  getMaxBounds,
  enlargeBounds,
};
