'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const validator = require("../../../config/functions/slugValidator.js");

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
  },
};