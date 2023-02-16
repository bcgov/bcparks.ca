"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const updateName = async (data) => {
  data.name = ":";
  if (data.protectedArea) {
    const { orcs = { orcs: "" } } = await strapi.services[
      "protected-area"
    ].findOne({
      id: data.protectedArea,
    });
    data.name = orcs;
  }
  if (data.site) {
    const { orcsSiteNumber = { orcsSiteNumber: null } } = await strapi.services[
      "site"
    ].findOne({
      id: data.site,
    });
    if (orcsSiteNumber) data.name = orcsSiteNumber;
  }

  data.name += ":";
  if (data.activityType) {
    const { activityName } = await strapi.services["activity-type"].findOne({
      id: data.activityType,
    });
    data.name += activityName;
  }
  return data;
};

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      data = await updateName(data);
    },
    async beforeUpdate(params, data) {
      data = await updateName(data);
    },
  },
};
