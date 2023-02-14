"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { managementAreaNumber } = ctx.params;
    const entity = await strapi.services["management-area"].findOne({
      managementAreaNumber,
    });
    return sanitizeEntity(entity, {
      model: strapi.contentTypes["management-area"],
    });
  },
};
