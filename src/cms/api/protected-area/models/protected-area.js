"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

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

const regex = new RegExp("^[a-z0-9/]+(?:-[a-z0-9/]+)*$|^$");
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
    afterCreate: async (data) => {
      saveParkAccessStatus(data);
    },
    afterUpdate: async (data) => {
      saveParkAccessStatus(data);
    },
  },
};
