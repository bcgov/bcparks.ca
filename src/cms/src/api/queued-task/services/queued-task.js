"use strict";

/**
 * queued-task service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::queued-task.queued-task",
  ({ strapi }) => ({
    async deleteMany(documentIds) {
      let count = 0;
      for (const documentId of documentIds) {
        try {
          await strapi
            .documents("api::queued-task.queued-task")
            .delete({ documentId });
          count++;
        } catch (error) {
          strapi.log.error(`Error deleting queued-task ${documentId}:`, error);
        }
      }
      return { count };
    },
  }),
);
