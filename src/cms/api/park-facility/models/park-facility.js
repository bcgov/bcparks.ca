"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      data.name = "unassigned";
      if (data.facilityType) {
        const facilityType = await strapi.services["facility-type"].findOne({
          id: data.facilityType,
        });
        data.name = facilityType.facilityName;
      }
    },
    async beforeUpdate(params, data) {
      data.name = "unassigned";
      if (data.facilityType) {
        const facilityType = await strapi.services["facility-type"].findOne({
          id: data.facilityType,
        });
        data.name = facilityType.facilityName;
      }
    },
  },
};
