"use strict";

/**
 * park-name service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::park-name.park-name");
