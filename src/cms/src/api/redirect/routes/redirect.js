"use strict";

/**
 * redirect router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::redirect.redirect");
