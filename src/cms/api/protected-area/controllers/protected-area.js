"use strict";
const { sanitizeEntity } = require("strapi-utils");
const customStatus = require("../custom/protected-area-status");
const customName = require("../custom/protected-area-names");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { orcs } = ctx.params;
    const entity = await strapi.services["protected-area"].findOne({ orcs });
    return sanitizeEntity(entity, { model: strapi.models["protected-area"] });
  },
  async names(ctx) {
    return customName.getProtectedAreaNames(ctx);
  },
  async items(ctx) {
    return customName.getProtectedAreaItems(ctx);
  },
  async status(ctx) {
    return customStatus.getProtectedAreaStatus(ctx);
  },
};
