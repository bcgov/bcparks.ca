"use strict";

/**
 * public-advisory-audit service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::public-advisory-audit.public-advisory-audit"
);
