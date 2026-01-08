/*
 * ============================================================
 * STRAPI 5 LIFECYCLE HOOKS - MIGRATED TO DOCUMENT SERVICE
 * ============================================================
 *
 * NOTE: This lifecycle logic has been migrated to Document Service Middleware
 * in src/index.js as recommended by Strapi v5 migration guide.
 *
 * This file is kept for reference but the main logic now runs through the
 * centralized middleware to properly handle Draft & Publish and i18n features.
 *
 * Migration Guide: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service
 * Document Service Middlewares: https://docs.strapi.io/cms/api/document-service/middlewares
 *
 * ============================================================
 */

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
  const subArea = await strapi.documents("api::park-operation-sub-area.park-operation-sub-area").findOne({
    documentId: subAreaId,
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
    const subAreaDate = await strapi.documents("api::park-operation-sub-area-date.park-operation-sub-area-date").findOne({
      documentId: where.documentId,
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

