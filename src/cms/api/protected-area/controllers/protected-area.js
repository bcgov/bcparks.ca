"use strict";
const { sanitizeEntity } = require("strapi-utils");
const custom = require("../custom/protected-area-custom");

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
    return custom.getProtecteAreaNames(ctx);
  },
  async status(ctx) {
    return custom.getProtecteAreaStatus(ctx);
  },
};
