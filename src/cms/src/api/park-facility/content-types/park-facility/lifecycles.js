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
      .findOne(data.site);
    if (orcsSiteNumber) data.name = orcsSiteNumber;
  }

  data.name += ":";
  if (data.facilityType) {
    const { facilityName } = await strapi
      .service("api::facility-type.facility-type")
      .findOne(data.facilityType);
    data.name += facilityName;
  }
  return data;
};

// Disabled it since it causes error
// TODO: Check if it is really necessary
module.exports = {
  async beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    // data = await updateName(data);
  },
  async beforeUpdate(event) {
    const { data, where, select, populate } = event.params;
    // data = await updateName(data);
  },
};
