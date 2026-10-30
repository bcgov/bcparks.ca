"use strict";

/**
 * redirect service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::redirect.redirect");
