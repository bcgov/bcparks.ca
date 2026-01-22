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

const validator = require("../../../../helpers/validator.js");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const updateName = async (data, where) => {
  if (data.documentId) {
    const documentId = data.documentId;

    const parkCampingType = await strapi
      .documents("api::park-camping-type.park-camping-type")
      .findOne({
        documentId,
        populate: ["protectedArea", "site", "campingType"],
        status: data.status,
      });

    if (!parkCampingType) {
      return data;
    }

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
    validator.campingTypeValidator(data.campingType);
  },
  async beforeUpdate(event) {
    let { data, where } = event.params;
    data = await updateName(data, where);
    validator.campingTypeValidator(data.campingType);
  },
};
