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
      console.log("Park access status find:", ctx.request.query);
      let parkAccessStatuses;
      // Performance checking to prevent falling down - there's a cached endpoint to use instead.  See /park-access-statuses-cache
      if (ctx?.request?.query?.limit > 10) {
        ctx.request.query.limit = 10;
      }
      parkAccessStatuses = await customStatus.getProtectedAreaStatus(ctx);
      return parkAccessStatuses;
    },
  })
);
