"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const validator = require("../../../../helpers/validator.js");

const saveParkAccessStatus = async (data) => {
  try {
    const updateResult = await strapi.db
      .query(
        "api::park-access-status.park-access-status"
      )
      .updateMany(
        {
          where: {
            orcs: data.result.orcs
          },
          data: {
            orcs: data.result.orcs,
            publishedAt: new Date(),
            updatedAt: new Date()
          }
        });
    if (updateResult.count === 0) {
      await strapi.entityService.create(
        "api::park-access-status.park-access-status", {
        data: {
          orcs: data.result.orcs,
          publishedAt: new Date()
        }
      })
    }
  } catch (error) {
    strapi.log.error(
      `error saving park-access-status for orcs ${data.result?.orcs}...`,
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
  afterCreate: async (data) => {
    saveParkAccessStatus(data);
  },
  afterUpdate: async (data) => {
    saveParkAccessStatus(data);
  }
};
