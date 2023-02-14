"use strict";

/**
 * event-type router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::event-type.event-type");
