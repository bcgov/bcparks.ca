"use strict";

/**
 * statutory-holiday service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::statutory-holiday.statutory-holiday");
