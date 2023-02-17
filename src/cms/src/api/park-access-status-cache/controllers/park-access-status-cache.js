"use strict";

/**
 * park-access-status-cache controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

// module.exports = {
//   async find(ctx) {
//     console.log("Park access status cache find:", ctx);
//     return strapi.services["park-access-status-cache"].find({ _limit: 1200 });
//   },
// };

module.exports = createCoreController(
  "api::park-access-status-cache.park-access-status-cache",
  ({ strapi }) => ({
    find: async (ctx, next) => {
      const entities = await strapi
        .service("api::park-access-status-cache.park-access-status-cache")
        .find({ limit: 1200 });
      return entities;
    },
  })
);
