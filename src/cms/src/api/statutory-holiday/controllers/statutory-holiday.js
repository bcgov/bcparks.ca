"use strict";

/**
 * statutory-holiday controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::statutory-holiday.statutory-holiday"
);
