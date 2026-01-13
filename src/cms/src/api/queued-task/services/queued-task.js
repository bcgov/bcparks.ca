'use strict';

/**
 * queued-task service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService("api::queued-task.queued-task", ({ strapi }) => ({
  async deleteMany(ids) {
    for (const id of ids) {
      try {
        await strapi.documents("api::queued-task.queued-task").delete({ documentId: id });
      } catch (error) {
        strapi.log.error(`Error deleting queued-task ${id}:`, error);
      }
    }
  }
}));
