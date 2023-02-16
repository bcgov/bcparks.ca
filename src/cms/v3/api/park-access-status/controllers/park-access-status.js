"use strict";

const customStatus = require("../../protected-area/custom/protected-area-status");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    console.log("Park access status find:", ctx.request.query);
    let parkAccessStatuses;
    // Performance checking to prevent falling down - there's a cached endpoint to use instead.  See /park-access-statuses-cache
    if (ctx?.request?.query?._limit > 10) {
      ctx.request.query._limit = 10;
    }
    parkAccessStatuses = await customStatus.getProtectedAreaStatus(ctx);
    return parkAccessStatuses;
  },
};
