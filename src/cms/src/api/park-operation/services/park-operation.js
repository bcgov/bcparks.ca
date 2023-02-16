"use strict";

/**
 * park-operation service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::park-operation.park-operation");
