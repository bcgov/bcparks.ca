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

    const parkFacility = await strapi
      .documents("api::park-facility.park-facility")
      .findOne({
        documentId,
        populate: ["protectedArea", "site", "facilityType"],
        status: data.status,
      });

    if (!parkFacility) {
      return data;
    }

    const protectedArea = parkFacility.protectedArea;
    const site = parkFacility.site;
    const facilityType = parkFacility.facilityType;

    data.name = "";
    if (protectedArea) {
      data.name = protectedArea.orcs;
    }
    if (site) {
      data.name = site.orcsSiteNumber;
    }
    if (facilityType) {
      data.name += ":";
      data.name += facilityType.facilityName;
    }
  }
  return data;
};

module.exports = {
  async beforeCreate(event) {
    let { data } = event.params;
    data = await updateName(data);
    validator.facilityTypeValidator(data.facilityType);
    validator.protectedAreaOrSiteValidator(data.protectedArea, data.site);
  },
  async beforeUpdate(event) {
    let { data } = event.params;
    data = await updateName(data);
    validator.facilityTypeValidator(data.facilityType);
    validator.protectedAreaOrSiteValidator(data.protectedArea, data.site);
  },
};
