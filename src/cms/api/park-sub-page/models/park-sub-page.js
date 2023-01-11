'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const slugValidator = require("../../../config/functions/slugValidator.js");

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      slugValidator(data.slug)
    },
    beforeUpdate: async (params, data) => {
      slugValidator(data.slug)
    },
  },
};