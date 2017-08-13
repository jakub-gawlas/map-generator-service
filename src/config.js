const { env } = process;

const mapboxToken = env.APP_MAP_SERVICE_MAPBOX_TOKEN;
if(!mapboxToken) throw new Error('Required set env var `APP_MAP_SERVICE_MAPBOX_TOKEN`');

module.exports = {
  APP_SERVER_PORT: env.APP_SERVER_PORT || 3000,
  APP_MAP_SERVICE_WEB_PORT: env.APP_MAP_SERVICE_WEB_PORT || 8080,
  APP_MAP_SERVICE_MAPBOX_TOKEN: mapboxToken,
};
