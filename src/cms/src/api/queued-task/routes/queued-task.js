"use strict";

/**
 * queued-task router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::queued-task.queued-task");
