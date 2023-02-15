"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const validator = require("../../../config/functions/slugValidator.js");

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      validator.slugCharacterValidator(data.Slug)
      validator.slugLeadingSlashValidator(data.Slug)
      validator.slugNoLeadingDashValidator(data.Slug)
      validator.slugNoTrailingDashValidator(data.Slug)
    },
    beforeUpdate: async (params, data) => {
      validator.slugCharacterValidator(data.Slug)
      validator.slugLeadingSlashValidator(data.Slug)
      validator.slugNoLeadingDashValidator(data.Slug)
      validator.slugNoTrailingDashValidator(data.Slug)
    },
  },
};
