"use strict";

/**
 * park-facility controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::park-facility.park-facility",
  ({ strapi }) => ({
    async update(ctx) {
      const cachePlugin = strapi.plugins["rest-cache"];
      if (cachePlugin) {
        // clear the redis rest-cache when updates are made from the staff portal
        cachePlugin.services.cacheStore.clearByUid('api::protected-area.protected-area')
      }
      const response = await super.update(ctx);
      return response;
    }
  })
);
