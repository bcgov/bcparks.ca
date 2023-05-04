"use strict";

/**
 * park-access-status controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const customStatus = require("../../protected-area/custom/protected-area-status");

module.exports = createCoreController(
  "api::park-access-status.park-access-status",
  ({ strapi }) => ({
    async find(ctx) {
      let parkAccessStatuses;
      if (ctx?.request?.query?.limit > 100 || !ctx?.request?.query?.limit) {
        ctx.request.query.limit = 100;
      }
      parkAccessStatuses = await customStatus.getProtectedAreaStatus(ctx);
      return parkAccessStatuses;
    },
  })
);
