"use strict";

/**
 * site controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::site.site");
