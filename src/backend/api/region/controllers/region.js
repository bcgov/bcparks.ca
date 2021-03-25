"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { RegionNumber } = ctx.params;
    const entity = await strapi.services.region.findOne({ RegionNumber });
    return sanitizeEntity(entity, { model: strapi.models.region });
  },
};
