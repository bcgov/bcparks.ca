"use strict";

/**
 * park-name controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::park-name.park-name",
  ({ strapi }) => ({
    async items() {
      const entities = await strapi.service("api::park-name.park-name").items();
      return entities;
    },
  })
);
