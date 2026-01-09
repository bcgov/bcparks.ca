const jwtOverride = require("./services/keycloak-jwt");
const authStrategyOverride = require("./strategies/keycloak-users-permissions");

module.exports = async (plugin) => {
  plugin.services.keycloakJwt = (ctx) => jwtOverride(ctx);

  // Register Keycloak authentication strategy for Strapi v5
  const bootstrap = plugin.bootstrap;
  plugin.bootstrap = async ({ strapi }) => {
    if (bootstrap) {
      await bootstrap({ strapi });
    }

    // In Strapi v5, register auth strategies through the plugin service
    const usersPermissionsPlugin = strapi.plugin("users-permissions");
    if (
      usersPermissionsPlugin &&
      usersPermissionsPlugin.service("providers-registry")
    ) {
      const providersRegistry =
        usersPermissionsPlugin.service("providers-registry");

      // Register the custom Keycloak strategy
      if (
        providersRegistry &&
        typeof providersRegistry.register === "function"
      ) {
        providersRegistry.register("content-api", authStrategyOverride);
      }
    }
  };

  return plugin;
};
