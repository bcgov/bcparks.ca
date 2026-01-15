"use strict";

/**
 * queued-task service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::queued-task.queued-task",
  ({ strapi }) => ({
    async deleteMany(ids) {
      for (const documentId of ids) {
        try {
          await strapi
            .documents("api::queued-task.queued-task")
            .delete({ documentId: documentId });
        } catch (error) {
          strapi.log.error(`Error deleting queued-task ${documentId}:`, error);
        }
      }
    },
  }),
);
