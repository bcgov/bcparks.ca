"use strict";

/**
 * legacy-redirect service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::legacy-redirect.legacy-redirect");
