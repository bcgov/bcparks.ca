"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const updateName = async (data, where) => {
  if (where) {
    const id = where.id
    const parkFacility = await strapi.entityService.findOne(
      "api::park-facility.park-facility", id, { populate: '*'}
    )
    const protectedArea = parkFacility.protectedArea
    const site = parkFacility.site
    const facilityType = parkFacility.facilityType
  
    data.name = ""
    if (protectedArea) {
      data.name = protectedArea.orcs
    }
    if (site) {
      data.name = site.orcsSiteNumber
    }
    if (facilityType) {
      data.name += ":"
      data.name += facilityType.facilityName;
    }
  }
  return data
};

module.exports = {
  async beforeCreate(event) {
    let { data, where } = event.params;
    data = await updateName(data, where);  },
  async beforeUpdate(event) {
    let { data, where } = event.params;
    data = await updateName(data, where);
  },
};
