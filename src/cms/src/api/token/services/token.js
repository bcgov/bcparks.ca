"use strict";

/**
 * token service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::token.token");
