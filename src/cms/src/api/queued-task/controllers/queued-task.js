"use strict";

/**
 * queued-task controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::queued-task.queued-task",
  ({ strapi }) => ({
    async deleteMany(ctx) {
      let result = { count: 0 };
      try {
        result = await strapi
          .service("api::queued-task.queued-task")
          .deleteMany(ctx.request.body);
      } catch (error) {
        return ctx.internalServerError(
          "Error in service queued-task:deleteMany()",
          error.message,
        );
      }
      ctx.send(
        {
          message: `Deleted ${result.count} items from queued-tasks`,
        },
        201,
      );
    },
  }),
);
