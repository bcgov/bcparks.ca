"use strict";

const { indexPark, removePark } = require("../../../../helpers/taskQueue.js");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const validator = require("../../../../helpers/validator.js");

const saveParkAccessStatus = async (ctx) => {
  try {
    if (ctx.result?.orcs) {
      const updateResult = await strapi.db
        .query(
          "api::park-access-status.park-access-status"
        )
        .updateMany(
          {
            where: {
              orcs: ctx.result.orcs
            },
            data: {
              orcs: ctx.result.orcs,
              publishedAt: new Date(),
              updatedAt: new Date()
            }
          });
      if (updateResult.count === 0) {
        await strapi.entityService.create(
          "api::park-access-status.park-access-status", {
          data: {
            orcs: ctx.result.orcs,
            publishedAt: new Date()
          }
        })
      }
    }
  } catch (error) {
    strapi.log.error(
      `error saving park-access-status for orcs ${ctx.result?.orcs}...`,
      error
    );
  }
};

module.exports = {
  beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    validator.slugCharacterValidator(data.slug)
    validator.slugNoLeadingSlashValidator(data.slug)
    validator.slugNoLeadingDashValidator(data.slug)
    validator.slugNoTrailingDashValidator(data.slug)
  },
  beforeUpdate(event) {
    const { data, where, select, populate } = event.params;
    validator.slugCharacterValidator(data.slug)
    validator.slugNoLeadingSlashValidator(data.slug)
    validator.slugNoLeadingDashValidator(data.slug)
    validator.slugNoTrailingDashValidator(data.slug)
  },
  afterCreate: async (ctx) => {
    await indexPark(ctx.params?.where?.id);
    saveParkAccessStatus(ctx);
  },
  afterUpdate: async (ctx) => {
    await indexPark(ctx.params?.where?.id);
    saveParkAccessStatus(ctx);
  },
  beforeDelete: async (ctx) => {
    await removePark(ctx.params?.where?.id);
  },
};
