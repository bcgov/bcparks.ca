"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      data.name = "unassigned";
      if (data.activityType) {
        const activityType = await strapi.services["activity-type"].findOne({
          id: data.activityType,
        });
        data.name = activityType.activityName;
      }
    },
    async beforeUpdate(params, data) {
      data.name = "unassigned";
      if (data.activityType) {
        const activityType = await strapi.services["activity-type"].findOne({
          id: data.activityType,
        });
        data.name = activityType.activityName;
      }
    },
  },
};
