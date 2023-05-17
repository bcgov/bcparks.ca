"use strict";

/**
 * fire-ban-prohibition controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::fire-ban-prohibition.fire-ban-prohibition",
  ({ strapi }) => ({
    async propagate(ctx) {

      try {
        await strapi
          .service("api::fire-ban-prohibition.fire-ban-prohibition")
          .rescindAllProtectedAreaFireBans();
      } catch (error) {
        return ctx.internalServerError(
          "Error in service fire-ban-prohibition:rescindAllProtectedAreaFireBans()",
          error.message
        );
      }
      
      let result;

      try {
        result = await strapi
          .service("api::fire-ban-prohibition.fire-ban-prohibition")
          .generateAllProtectedAreaFireBans();
      } catch (error) {
        return ctx.internalServerError(
          "Error in service fire-ban-prohibition:generateAllProtectedAreaFireBans()",
          error.message
        );
      }

      const cachePlugin = strapi.plugins["rest-cache"];
      if (cachePlugin) {
        await cachePlugin.services.cacheStore.clearByUid('api::protected-area.protected-area');
        await cachePlugin.services.cacheStore.clearByUid('api::park-access-status.park-access-status');
        await cachePlugin.services.cacheStore.clearByUid('api::public-advisory.public-advisory');
      }

      ctx.send({
        message: `Propagation complete! ${result.campfireBanCount} campfire bans impacting ${result.parkCount} protected areas.`
      }, 201);
    }
  })
);
