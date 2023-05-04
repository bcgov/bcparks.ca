"use strict";

/**
 * management-area controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::management-area.management-area",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { managementAreaNumber } = ctx.params;
      const entity = await this.super({ managementAreaNumber }); // super - to extend the origin controller
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

      return this.transformResponse(sanitizedEntity);
    },
  })
);
