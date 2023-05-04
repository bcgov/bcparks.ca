"use strict";

/**
 * park-photo service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::park-photo.park-photo");
