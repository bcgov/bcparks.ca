"use strict";

/**
 * fire-ban-prohibition service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::fire-ban-prohibition.fire-ban-prohibition"
);
