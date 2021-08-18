"use strict";

const customStatus = require("../../protected-area/custom/protected-area-status");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const parkAccessStatuses = await customStatus.getProtectedAreaStatus(ctx);
    return parkAccessStatuses;
  },
};
