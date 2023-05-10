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

      try {
        await strapi
          .service("api::fire-ban-prohibition.fire-ban-prohibition")
          .generateAllProtectedAreaFireBans();
      } catch (error) {
        return ctx.internalServerError(
          "Error in service fire-ban-prohibition:generateAllProtectedAreaFireBans()",
          error.message
        );
      }

      ctx.send({
        message: 'Propagation complete!'
      }, 201);
    }
  })
);
