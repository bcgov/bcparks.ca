"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const validator = require("../../../config/functions/slugValidator.js");

const saveParkAccessStatus = async (data) => {
  strapi.services["park-access-status"]
    .update({ orcs: data.orcs }, { orcs: data.orcs })
    .catch(async () => {
      strapi.services["park-access-status"]
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
  lifecycles: {
    beforeCreate: async (data) => {
      validator.slugCharacterValidator(data.slug)
      validator.slugNoLeadingSlashValidator(data.slug)
      validator.slugNoLeadingDashValidator(data.slug)
      validator.slugNoTrailingDashValidator(data.slug)
    },
    beforeUpdate: async (params, data) => {
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
    },
  },
};
