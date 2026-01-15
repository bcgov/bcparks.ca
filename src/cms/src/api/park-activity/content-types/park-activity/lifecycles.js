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
  let protectedArea, site, activityType;

  if (where?.documentId) {
    const parkActivity = await strapi
      .documents("api::park-activity.park-activity")
      .findOne({
        documentId: where.documentId,
        populate: "*",
      });

    if (parkActivity) {
      protectedArea = parkActivity.protectedArea;
      site = parkActivity.site;
      activityType = parkActivity.activityType;
    }
  } else {
    // Create: extract documentIds from data (handle connect syntax if present)
    const getDocumentId = (relation) => {
      if (!relation) return null;
      if (typeof relation === "string") return relation;
      if (relation.connect?.[0])
        return typeof relation.connect[0] === "string"
          ? relation.connect[0]
          : relation.connect[0].documentId;
      return null;
    };

    const protectedAreaId = getDocumentId(data.protectedArea);
    const siteId = getDocumentId(data.site);
    const activityTypeId = getDocumentId(data.activityType);

    if (protectedAreaId) {
      protectedArea = await strapi
        .documents("api::protected-area.protected-area")
        .findOne({
          documentId: protectedAreaId,
          fields: ["orcs"],
        });
    }
    if (siteId) {
      site = await strapi.documents("api::site.site").findOne({
        documentId: siteId,
        fields: ["orcsSiteNumber"],
      });
    }
    if (activityTypeId) {
      activityType = await strapi
        .documents("api::activity-type.activity-type")
        .findOne({
          documentId: activityTypeId,
          fields: ["activityName"],
        });
    }
  }

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

  return data;
};

module.exports = {
  async beforeCreate(event) {
    let { data, where } = event.params;
    event.params.data = await updateName(data, where);
    validator.activityTypeValidator(event.params.data.activityType);
    validator.protectedAreaOrSiteValidator(
      event.params.data.protectedArea,
      event.params.data.site,
    );
  },
  async beforeUpdate(event) {
    let { data, where } = event.params;
    event.params.data = await updateName(data, where);
    validator.activityTypeValidator(event.params.data.activityType);
    validator.protectedAreaOrSiteValidator(
      event.params.data.protectedArea,
      event.params.data.site,
    );
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
    const parkActivity = await strapi
      .documents("api::park-activity.park-activity")
      .findOne({
        documentId: where.documentId,
        fields: ["id"],
        populate: { protectedArea: { fields: ["id"] } },
      });
    await indexPark(parkActivity.protectedArea?.id);
  },
};
