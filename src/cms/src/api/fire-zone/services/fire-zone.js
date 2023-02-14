"use strict";

/**
 * fire-zone service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::fire-zone.fire-zone");
