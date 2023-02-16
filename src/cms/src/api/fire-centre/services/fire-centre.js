"use strict";

/**
 * fire-centre service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::fire-centre.fire-centre");
