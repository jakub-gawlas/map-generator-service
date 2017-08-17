/**
 * Return promise, resolved to map in format base64 png
 * @param {*} param0 
 */
function getMap({ data, maxBounds, width, height }) {
  return new Promise((resolve, reject) => {
    const map = L.mapbox
      .map('map', 'mapbox.streets', { attributionControl: false })
      .whenReady(resolve)
      .fitBounds(maxBounds);

    L.mapbox.featureLayer().setGeoJSON(data).addTo(map);

    // Remove MapBox control
    const controlContainer = document.getElementsByClassName(
      'leaflet-control-container'
    )[0];
    if (controlContainer) {
      controlContainer.parentNode.removeChild(controlContainer);
    }
  });
}
