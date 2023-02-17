"use strict";

/**
 * park-name controller
 */

const { createCoreController } = require("@strapi/strapi").factories;


// module.exports = {
//     async items() {
//       // custom route for lightweight park names used in client app
//       const entities = await strapi.services["park-name"].items();
//       return entities;
//     },
//   };


module.exports = createCoreController(
  "api::park-name.park-name",
  ({ strapi }) => ({
    items: async (ctx, next) => {
      const entities = await strapi.service("api::park-name.park-name").items();
      return entities;
    },
  })
);
