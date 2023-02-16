"use strict";

/**
 * public-advisory service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::public-advisory.public-advisory");
