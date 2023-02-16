"use strict";

/**
 * website controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::website.website");
