const jwtOverride = require("./services/keycloak-jwt");
const authStrategyOverride = require("./strategies/keycloak-users-permissions");

module.exports = async (plugin) => {
  plugin.services.keycloakJwt = (ctx) => jwtOverride(ctx);

  // TODO: Temporarily disabled for Strapi v5 upgrade - needs auth API migration
  // The strapi.container.get('auth') API has been replaced in v5
  // Need to review keycloak integration approach for v5
  /*
    const bootstrap = plugin.bootstrap;
    plugin.bootstrap = async ({ strapi }) => {
        if (bootstrap) {
            await bootstrap({ strapi });
        }
        strapi.get('auth').register('content-api', authStrategyOverride);
    };
    */

  return plugin;
};
