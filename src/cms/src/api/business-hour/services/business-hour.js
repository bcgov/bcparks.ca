"use strict";

/**
 * business-hour service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::business-hour.business-hour");
