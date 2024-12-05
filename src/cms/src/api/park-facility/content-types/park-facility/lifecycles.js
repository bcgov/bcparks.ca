"use strict";

const { indexPark } = require("../../../../helpers/taskQueue.js");
const validator = require("../../../../helpers/validator.js");

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
    data = await updateName(data, where);
    validator.facilityTypeConnectValidator(data.facilityType)
  },
  async beforeUpdate(event) {
    let { data, where } = event.params;
    data = await updateName(data, where);
    validator.facilityTypeDisconnectValidator(data.facilityType)
    for (const park of event.params.data?.protectedArea?.disconnect || []) {
      await indexPark(park.id)
    }
  },
  async afterUpdate(event) {
    await indexPark(event.result.protectedArea?.id)
  },
  async afterCreate(event) {
    await indexPark(event.result.protectedArea?.id)
  },
  async beforeDelete(event) {
    let { where } = event.params;
    const parkFacility = await strapi.entityService.findOne(
      "api::park-facility.park-facility", where.id, {
      fields: ['id'],
      populate: { protectedArea: { fields: ['id'] } }
    });
    await indexPark(parkFacility.protectedArea?.id)
  }
};
