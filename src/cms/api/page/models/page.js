"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const regex = new RegExp("^[a-z0-9/]+(?:-[a-z0-9/]+)*$|^$");
const slugValidator = async (data) => {
    if (!regex.test(data.Slug)) {
      throw strapi.errors.badRequest('Please enter letters, numbers, hyphens, or slashes for slug. No spaces.');
    }
}

module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
          slugValidator(data)
        },
        beforeUpdate: async (data) => {
          slugValidator(data)
        },
    },
};
