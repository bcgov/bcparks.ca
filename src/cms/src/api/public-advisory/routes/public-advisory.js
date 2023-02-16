"use strict";

/**
 * public-advisory router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::public-advisory.public-advisory");
