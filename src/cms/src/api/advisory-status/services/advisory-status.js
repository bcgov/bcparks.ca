"use strict";

/**
 * advisory-status service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::advisory-status.advisory-status");
