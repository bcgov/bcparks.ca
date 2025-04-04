const jwtOverride = require('./services/keycloak-jwt');
const authStrategyOverride = require("./strategies/keycloak-users-permissions")

module.exports = async (plugin) => {
    plugin.services.keycloakJwt = (ctx) => jwtOverride(ctx);
    // strapi.container.get('auth').register('content-api', authStrategyOverride);

    // Check if the 'auth' service is available in Strapi 5
    if (strapi.auth) {
      strapi.auth.register('content-api', authStrategyOverride);
    } else {
      // Handle the case where the 'auth' service is not available
      console.error("Auth service is not available in Strapi 5");
    }
    return plugin;
};
