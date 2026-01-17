const jwtOverride = require("./services/keycloak-jwt");
const authStrategyOverride = require("./strategies/keycloak-users-permissions");

module.exports = (plugin) => {
  plugin.services.keycloakJwt = jwtOverride;

  plugin.bootstrap = async ({ strapi }) => {
    strapi.get("auth").register("content-api", authStrategyOverride);
  };

  return plugin;
};
