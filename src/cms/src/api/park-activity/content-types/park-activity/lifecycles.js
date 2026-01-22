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

    const parkActivity = await strapi
      .documents("api::park-activity.park-activity")
      .findOne({
        documentId,
        populate: ["protectedArea", "site", "activityType"],
        status: data.status,
      });

    if (!parkActivity) {
      return data;
    }

    const protectedArea = parkActivity.protectedArea;
    const site = parkActivity.site;
    const activityType = parkActivity.activityType;

    data.name = "";
    if (protectedArea) {
      data.name = protectedArea.orcs;
    }
    if (site) {
      data.name = site.orcsSiteNumber;
    }
    if (activityType) {
      data.name += ":";
      data.name += activityType.activityName;
    }
  }
  return data;
};

module.exports = {
  async beforeCreate(event) {
    let { data } = event.params;
    data = await updateName(data);
    validator.activityTypeValidator(data.activityType);
    validator.protectedAreaOrSiteValidator(data.protectedArea, data.site);
  },
  async beforeUpdate(event) {
    let { data } = event.params;
    data = await updateName(data);
    validator.activityTypeValidator(data.activityType);
    validator.protectedAreaOrSiteValidator(data.protectedArea, data.site);
  },
};
