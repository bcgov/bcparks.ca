"use strict";

/**
 * legacy-redirect controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::legacy-redirect.legacy-redirect");
