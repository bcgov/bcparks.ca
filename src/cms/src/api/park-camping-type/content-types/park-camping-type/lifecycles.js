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
const validator = require("../../../../helpers/validator.js");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const updateName = async (data, where) => {
  if (where) {
    const documentId = where.documentId;
    const parkCampingType = await strapi
      .documents("api::park-camping-type.park-camping-type")
      .findOne({
        documentId,
        populate: "*",
      });
    const protectedArea = parkCampingType.protectedArea;
    const site = parkCampingType.site;
    const campingType = parkCampingType.campingType;

    data.name = "";
    if (protectedArea) {
      data.name = protectedArea.orcs;
    }
    if (site) {
      data.name = site.orcsSiteNumber;
    }
    if (campingType) {
      data.name += ":";
      data.name += campingType.campingTypeName;
    }
  }
  return data;
};

module.exports = {
  async beforeCreate(event) {
    let { data, where } = event.params;
    data = await updateName(data, where);
    validator.campingTypeConnectValidator(data.campingType);
  },
  async beforeUpdate(event) {
    let { data, where } = event.params;
    data = await updateName(data, where);
    validator.campingTypeDisconnectValidator(data.campingType);
    for (const park of event.params.data?.protectedArea?.disconnect || []) {
      await indexPark(park.id);
    }
  },
  async afterUpdate(event) {
    await indexPark(event.result.protectedArea?.id);
  },
  async afterCreate(event) {
    await indexPark(event.result.protectedArea?.id);
  },
  async beforeDelete(event) {
    let { where } = event.params;
    const parkCampingType = await strapi
      .documents("api::park-camping-type.park-camping-type")
      .findOne({
        documentId: where.documentId,
        fields: ["id"],
        populate: { protectedArea: { fields: ["id"] } },
      });
    await indexPark(parkCampingType.protectedArea?.id);
  },
};
