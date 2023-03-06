const jwtOverride = require('./services/keycloak-jwt');
const authStrategyOverride = require("./strategies/keycloak-users-permissions")

module.exports = async (plugin) => {
    plugin.services.keycloakJwt = (ctx) => jwtOverride(ctx);
    strapi.container.get('auth').register('content-api', authStrategyOverride);
    return plugin;
};
