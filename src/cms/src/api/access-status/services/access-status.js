"use strict";

/**
 * access-status service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::access-status.access-status");
