"use strict";

/**
 * protected-area service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::protected-area.protected-area", ({ strapi }) => ({
  async items() {
    const results = await strapi.db.query('api::protected-area.protected-area').findMany(
      {
        select: ["id", "orcs", "protectedAreaName"],
        limit: 2000,
        orderBy: ['protectedAreaName'],
      }
    );
    return results;
  }
})
);
