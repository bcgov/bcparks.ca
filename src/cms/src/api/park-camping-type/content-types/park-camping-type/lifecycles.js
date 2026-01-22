/**
 * Strapi 5 lifecycle hooks for Document Service
 * Migration Guide: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service
 * Document Service API: https://docs.strapi.io/cms/api/document-service
 */

"use strict";

const validator = require("../../../../helpers/validator.js");

const updateName = async (data) => {
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
    let { data } = event.params;
    data = await updateName(data);
    validator.campingTypeValidator(data.campingType);
    validator.protectedAreaOrSiteValidator(data.protectedArea, data.site);
  },
  async beforeUpdate(event) {
    let { data } = event.params;
    data = await updateName(data);
    validator.campingTypeValidator(data.campingType);
    validator.protectedAreaOrSiteValidator(data.protectedArea, data.site);
  },
};
