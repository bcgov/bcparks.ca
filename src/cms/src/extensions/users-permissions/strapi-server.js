const jwtOverride = require("./services/keycloak-jwt");

module.exports = (plugin) => {
  // Register the keycloakJwt service
  plugin.services.keycloakJwt = jwtOverride;

  return plugin;
};
