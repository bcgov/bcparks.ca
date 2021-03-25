"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { ManagementAreaNumber } = ctx.params;
    const entity = await strapi.services["management-area"].findOne({
      ManagementAreaNumber,
    });
    return sanitizeEntity(entity, { model: strapi.models["management-area"] });
  },
};
