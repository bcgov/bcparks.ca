"use strict";

/**
 * park-access-status-cache controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::park-access-status-cache.park-access-status-cache",
  ({ strapi }) => ({
    async find(ctx) {
      const entities = await strapi
        .service("api::park-access-status-cache.park-access-status-cache")
        .find({ limit: 1200 });
      return entities;
    },
  })
);
