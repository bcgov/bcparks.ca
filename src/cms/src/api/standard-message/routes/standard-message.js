"use strict";

/**
 * standard-message router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::standard-message.standard-message");
