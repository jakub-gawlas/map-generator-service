const { env } = process;

module.exports = {
  APP_SERVER_PORT: env.APP_SERVER_PORT || 3000,
  APP_MAP_SERVICE_WEB_PORT: env.APP_MAP_SERVICE_WEB_PORT || 8080,
};
