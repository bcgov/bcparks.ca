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
    const parkActivity = await strapi.entityService.findOne(
      "api::park-activity.park-activity", id, { populate: '*'}
    )
    const protectedArea = parkActivity.protectedArea
    const site = parkActivity.site
    const activityType = parkActivity.activityType
  
    data.name = ""
    if (protectedArea) {
      data.name = protectedArea.orcs
    }
    if (site) {
      data.name = site.orcsSiteNumber
    }
    if (activityType) {
      data.name += ":"
      data.name += activityType.activityName;
    }
  }
  return data
};

module.exports = {
  async beforeCreate(event) {
    let { data, where } = event.params;
    data = await updateName(data, where);
    validator.activityTypeConnectValidator(data.activityType)
  },
  async beforeUpdate(event) {
    let { data, where } = event.params;
    data = await updateName(data, where);
    validator.activityTypeDisconnectValidator(data.activityType)
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
    const parkActivity = await strapi.entityService.findOne(
      "api::park-activity.park-activity", where.id, {
      fields: ['id'],
      populate: { protectedArea: { fields: ['id'] } }
    });
    await indexPark(parkActivity.protectedArea?.id)
  }
};
