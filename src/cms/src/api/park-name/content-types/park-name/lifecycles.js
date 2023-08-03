"use strict";

const { indexPark } = require("../../../../helpers/taskQueue.js");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  async afterUpdate(event) {
    await indexPark(event.result.protectedArea?.id)
  },
  async afterCreate(event) {
    await indexPark(event.result.protectedArea?.id)
  },
  async beforeUpdate(event) {
    for (const park of event.params.data?.protectedArea?.disconnect || []) {
      await indexPark(park.id)
    }
  },
  async beforeDelete(event) {
    let { where } = event.params;
    const parkName = await strapi.entityService.findOne(
      "api::park-name.park-name", where.id, {
      fields: ['id'],
      populate: { protectedArea: { fields: ['id'] } }
    });
    await indexPark(parkName.protectedArea.id)
  }
};
