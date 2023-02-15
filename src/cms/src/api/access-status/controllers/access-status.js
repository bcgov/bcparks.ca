"use strict";

/**
 * access-status controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::management-area.management-area", ({ strapi }) => ({

  async findOne(ctx) {
    const { managementAreaNumber } = ctx.params;
    const entity = await strapi.findOne({
      managementAreaNumber,
    });

    return entity; // return sanitizeEntity(entity, { model: strapi.models["management-area"] });
  }
}));
