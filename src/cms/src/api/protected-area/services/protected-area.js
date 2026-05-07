"use strict";

/**
 * protected-area service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::protected-area.protected-area",
  ({ strapi }) => ({
    async items() {
      const results = await strapi
        .documents("api::protected-area.protected-area")
        .findMany({
          fields: ["id", "orcs", "protectedAreaName"],
          status: "published",
          limit: 2000,
          sort: ["protectedAreaName"],
        });
      return results;
    },
  }),
);
