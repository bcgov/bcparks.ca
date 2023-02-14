"use strict";

/**
 * public-advisory-audit router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter(
  "api::public-advisory-audit.public-advisory-audit"
);
