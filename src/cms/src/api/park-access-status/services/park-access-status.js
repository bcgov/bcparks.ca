"use strict";

/**
 * park-access-status service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::park-access-status.park-access-status"
);
