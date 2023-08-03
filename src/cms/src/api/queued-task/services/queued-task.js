'use strict';

/**
 * queued-task service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService("api::queued-task.queued-task", ({ strapi }) => ({
  async deleteMany(ids) {
    return await strapi.db.query("api::queued-task.queued-task")
      .deleteMany({
        where: {
          id: { $in: ids }
        }
      });
  }
}));
