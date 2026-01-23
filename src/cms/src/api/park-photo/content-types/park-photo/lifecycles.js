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

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  async afterCreate(event) {
    // If parkPhoto.protectedArea is selected, get that protectedArea.orcs in the parkPhoto.orcs
    if (event.result?.protectedArea) {
      const protectedAreaOrcs = event.result.protectedArea.orcs;
      event.result.orcs = protectedAreaOrcs;
      await strapi.documents("api::park-photo.park-photo").update({
        documentId: event.result.documentId,
        data: { orcs: protectedAreaOrcs },
      });
    }
    // If parkPhoto.site is selected, get that site.orcsSiteNumber in the parkPhoto.orcsSiteNumber
    if (event.result?.site) {
      const siteOrcs = event.result.site.orcsSiteNumber;
      event.result.orcsSiteNumber = siteOrcs;
      await strapi.documents("api::park-photo.park-photo").update({
        documentId: event.result.documentId,
        data: { orcsSiteNumber: siteOrcs },
      });
    }
  },
  async afterUpdate(event) {
    console.log(JSON.stringify(event));

    // If parkPhoto.protectedArea is selected, get that protectedArea.orcs in the parkPhoto.orcs
    if (event.result?.protectedArea !== undefined) {
      const protectedAreaOrcs = event.result.protectedArea?.orcs;
      if (event.result.orcs !== protectedAreaOrcs) {
        event.result.orcs = protectedAreaOrcs;
        await strapi.documents("api::park-photo.park-photo").update({
          documentId: event.result.documentId,
          data: { orcs: protectedAreaOrcs },
        });
      }
    }
    // If parkPhoto.site is selected, get that site.orcsSiteNumber in the parkPhoto.orcsSiteNumber
    if (event.result?.site !== undefined) {
      const siteOrcs = event.result.site?.orcsSiteNumber;
      if (event.result.orcsSiteNumber !== siteOrcs) {
        event.result.orcsSiteNumber = siteOrcs;
        await strapi.documents("api::park-photo.park-photo").update({
          documentId: event.result.documentId,
          data: { orcsSiteNumber: siteOrcs },
        });
      }
    }
  },
  async beforeUpdate(event) {
    if (event.params?.data?.protectedArea?.disconnect?.length > 0) {
      event.params.data.orcs = null;
    }
    if (event.params?.data?.site?.disconnect?.length > 0) {
      event.params.data.orcsSiteNumber = null;
    }
  },
};
