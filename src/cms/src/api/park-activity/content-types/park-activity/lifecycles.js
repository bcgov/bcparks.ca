"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const updateName = async (data) => {
  data.name = ":";
  if (data.protectedArea) {
    const { orcs = { orcs: "" } } = await strapi
      .service("api::protected-area.protected-area")
      .findOne(data.protectedArea);
    data.name = orcs;
  }
  if (data.site) {
    const { orcsSiteNumber = { orcsSiteNumber: null } } = await strapi
      .service("api::site.site")
      .findOne({
        id: data.site,
      });
    if (orcsSiteNumber) data.name = orcsSiteNumber;
  }

  data.name += ":";
  if (data.activityType) {
    const { activityName } = await strapi
      .service("api::activity-type.activity-type")
      .findOne({
        id: data.activityType,
      });
    data.name += activityName;
  }
  return data;
};

module.exports = {
  async beforeCreate(data) {
    data = await updateName(data);
  },
  async beforeUpdate(params, data) {
    data = await updateName(data);
  },
};
