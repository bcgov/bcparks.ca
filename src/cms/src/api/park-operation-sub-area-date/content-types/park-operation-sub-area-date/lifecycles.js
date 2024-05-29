"use strict";

const { indexPark } = require("../../../../helpers/taskQueue.js");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const indexParkBySubAreaId = async (subAreaId) => {
  if (!subAreaId) {
    return;
  }
  const subArea = await strapi.entityService.findOne(
    "api::park-operation-sub-area.park-operation-sub-area",
    subAreaId,
    {
      fields: ['id'],
      populate: { protectedArea: { fields: ['id'] } }
    });
  await indexPark(subArea?.protectedArea?.id)
};

module.exports = {
  async afterUpdate(event) {
    await indexParkBySubAreaId(event.result.parkOperationSubArea?.id)
  },
  async afterCreate(event) {
    await indexParkBySubAreaId(event.result.parkOperationSubArea?.id)
  },
  async beforeUpdate(event) {
    for (const park of event.params.data?.parkOperationSubArea?.disconnect || []) {
      await indexParkBySubAreaId(park.id)
    }
  },
  async beforeDelete(event) {
    let { where } = event.params;
    const subAreaDate = await strapi.entityService.findOne(
      "api::park-operation-sub-area-date.park-operation-sub-area-date",
      where.id,
      {
        fields: ['id'],
        populate: {
          parkOperationSubArea: {
            fields: ['id'],
            populate: { protectedArea: { fields: ['id'] } }
          }
        }
      });
    await indexPark(subAreaDate.parkOperationSubArea?.protectedArea?.id)
  }
};
