"use strict";

/**
 * protected-area router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::protected-area.protected-area");
