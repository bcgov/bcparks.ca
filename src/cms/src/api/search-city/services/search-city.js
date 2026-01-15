"use strict";

/**
 * search-city service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::search-city.search-city");
