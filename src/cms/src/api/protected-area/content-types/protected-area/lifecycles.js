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

const { indexPark, removePark } = require("../../../../helpers/taskQueue.js");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const validator = require("../../../../helpers/validator.js");

const saveParkAccessStatus = async (ctx) => {
  try {
    if (ctx.result?.orcs) {
      const updateResult = await strapi.documents("api::park-access-status.park-access-status").findMany({
        filters: {
          orcs: ctx.result.orcs
        }
      });

      if (updateResult.length > 0) {
        for (const result of updateResult) {
          await strapi.documents("api::park-access-status.park-access-status").update({
            documentId: result.documentId,
            data: {
              orcs: ctx.result.orcs,
              publishedAt: new Date(),
              updatedAt: new Date()
            }
          });
        }
      } else {
        await strapi.documents("api::park-access-status.park-access-status").create({
          data: {
            orcs: ctx.result.orcs,
            publishedAt: new Date()
          }
        })
      }
    }
  } catch (error) {
    strapi.log.error(
      `error saving park-access-status for orcs ${ctx.result?.orcs}...`,
      error
    );
  }
};

module.exports = {
  beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    validator.slugCharacterValidator(data.slug)
    validator.slugNoLeadingSlashValidator(data.slug)
    validator.slugNoLeadingDashValidator(data.slug)
    validator.slugNoTrailingDashValidator(data.slug)
  },
  beforeUpdate(event) {
    const { data, where, select, populate } = event.params;
    validator.slugCharacterValidator(data.slug)
    validator.slugNoLeadingSlashValidator(data.slug)
    validator.slugNoLeadingDashValidator(data.slug)
    validator.slugNoTrailingDashValidator(data.slug)
  },
  afterCreate: async (ctx) => {
    await indexPark(ctx.params?.where?.id);
    saveParkAccessStatus(ctx);
  },
  afterUpdate: async (ctx) => {
    await indexPark(ctx.params?.where?.id);
    saveParkAccessStatus(ctx);
  },
  beforeDelete: async (ctx) => {
    await removePark(ctx.params?.where?.id);
  },
};

