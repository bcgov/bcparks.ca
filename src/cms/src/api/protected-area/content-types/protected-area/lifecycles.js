"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const validator = require("../../../../helpers/slugValidator.js");

const saveParkAccessStatus = async (data) => {
  await strapi
    .service("api::park-access-status.park-access-status")
    .update({ orcs: data.orcs }, { orcs: data.orcs })
    .catch(async () => {
      await strapi
        .service("api::park-access-status.park-access-status")
        .create({ orcs: data.orcs })
        .catch((error) => {
          strapi.log.error(
            `error creating park-access-status ${data.id}...`,
            error
          );
        });
    });
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
