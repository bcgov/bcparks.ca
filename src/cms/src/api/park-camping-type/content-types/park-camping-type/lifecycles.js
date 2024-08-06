"use strict";

const { indexPark } = require("../../../../helpers/taskQueue.js");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const updateName = async (data, where) => {
  if (where) {
    const id = where.id
    const parkCampingType = await strapi.entityService.findOne(
      "api::park-camping-type.park-camping-type", id, { populate: '*'}
    )
    const protectedArea = parkCampingType.protectedArea
    const site = parkCampingType.site
    const campingType = parkCampingType.campingType

    data.name = ""
    if (protectedArea) {
      data.name = protectedArea.orcs
    }
    if (site) {
      data.name = site.orcsSiteNumber
    }
    if (campingType) {
      data.name += ":"
      data.name += campingType.campingTypeName;
    }
  }
  return data
};

module.exports = {
  async beforeCreate(event) {
    let { data, where } = event.params;
    data = await updateName(data, where);
  },
  async beforeUpdate(event) {
    let { data, where } = event.params;
    data = await updateName(data, where);
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
    const parkCampingType = await strapi.entityService.findOne(
      "api::park-camping-type.park-camping-type", where.id, {
      fields: ['id'],
      populate: { protectedArea: { fields: ['id'] } }
    });
    await indexPark(parkCampingType.protectedArea?.id)
  }
};
