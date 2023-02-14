"use strict";

/**
 * park-access-status-cache service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::park-access-status-cache.park-access-status-cache"
);
