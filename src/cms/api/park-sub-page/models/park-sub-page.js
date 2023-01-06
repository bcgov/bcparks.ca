'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const regex = new RegExp("^[a-z0-9/]+(?:-[a-z0-9/]+)*$")
const slugValidator = (data) => {
    if (!regex.test(data.slug)) {
      throw strapi.errors.badRequest('Please enter letters, numbers, hyphens, or slashes for slug. No spaces.');
    }
};

module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
          slugValidator(data)
        },
        beforeUpdate: async (params, data) => {
          slugValidator(data)          
        },
    },
};