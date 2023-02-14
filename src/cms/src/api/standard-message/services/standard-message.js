"use strict";

/**
 * standard-message service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::standard-message.standard-message");
