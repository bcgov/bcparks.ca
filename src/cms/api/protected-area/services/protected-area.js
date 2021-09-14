"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  // custom route for light weight park details used in client app
  async items() {
    const results = await strapi.query("protected-area").find(
      {
        _limit: -1,
        _sort: "protectedAreaName",
      },
      ["id", "orcs", "protectedAreaName"]
    );
    return results;
  },
  // custom route for park id and name only
  async names(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi
        .query("protected-area")
        .search(ctx.query, [
          "id",
          "orcs",
          "type",
          "typeCode",
          "protectedAreaName",
        ]);
    } else {
      entities = await strapi
        .query("protected-area")
        .find(ctx.query, [
          "id",
          "orcs",
          "type",
          "typeCode",
          "protectedAreaName",
        ]);
    }
    return entities;
  },
};
