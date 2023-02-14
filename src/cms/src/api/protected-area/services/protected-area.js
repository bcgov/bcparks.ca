"use strict";

/**
 * protected-area service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::protected-area.protected-area");
