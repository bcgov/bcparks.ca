/**
 * Strapi 5 lifecycle hooks for Document Service
 * Migration Guide: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service
 * Document Service API: https://docs.strapi.io/cms/api/document-service
 */

"use strict";

const updateName = async (data) => {
  if (data.documentId) {
    const documentId = data.documentId;

    const parkGuideline = await strapi
      .documents("api::park-guideline.park-guideline")
      .findOne({
        documentId,
        populate: "*",
      });

    if (!parkGuideline) {
      return data;
    }

    const protectedArea = parkGuideline.protectedArea;
    const site = parkGuideline.site;
    const guidelineType = parkGuideline.guidelineType;

    data.name = "";
    if (protectedArea) {
      data.name = protectedArea.orcs;
    }
    if (site) {
      data.name = site.orcsSiteNumber;
    }
    if (guidelineType) {
      data.name += ":";
      data.name += guidelineType.guidelineName;
    }
  }
  return data;
};

module.exports = {
  async beforeCreate(event) {
    let { data } = event.params;
    data = await updateName(data);
  },
  async beforeUpdate(event) {
    let { data } = event.params;
    data = await updateName(data);
  },
};
