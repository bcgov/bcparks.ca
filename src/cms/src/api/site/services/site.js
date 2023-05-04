"use strict";

/**
 * site service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::site.site");
