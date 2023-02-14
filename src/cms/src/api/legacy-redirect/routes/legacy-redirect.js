"use strict";

/**
 * legacy-redirect router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::legacy-redirect.legacy-redirect");
