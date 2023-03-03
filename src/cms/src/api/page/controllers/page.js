"use strict";

/**
 * page controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

// module.exports = createCoreController("api::page.page");

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::page.page', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

  //   const entity = await strapi.entityService.findMany('api::page.page', {
  //     ...query,
  //     populate: {
  //       your-field: {
  //     populate: {
  //       sub-field: true
  //     }
  //   },
  // },
  // });


    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  }
}));
