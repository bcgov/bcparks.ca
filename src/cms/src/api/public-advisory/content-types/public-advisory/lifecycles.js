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

const indexParks = async function (ctx) {
    let { where } = ctx.params;
    const advisory = await strapi.documents("api::public-advisory.public-advisory").findOne({
        documentId: where.documentId,
        fields: ['id'],
        populate: { protectedAreas: { fields: ['id'] } }
    });
    for (const pa of advisory.protectedAreas) {
        await indexPark(pa.id);
    }
};

const clearRestCache = async function () {
    const cachePlugin = strapi.plugins["rest-cache"];
    if (cachePlugin) {
        await cachePlugin.services.cacheStore.clearByUid('api::public-advisory.public-advisory');
        await cachePlugin.services.cacheStore.clearByUid('api::protected-area.protected-area');
        await cachePlugin.services.cacheStore.clearByUid('api::park-access-status.park-access-status');
    }
}

// clear the public advisories from the rest cache after all crud operations
module.exports = {
    afterCreate: async (ctx) => {
        await clearRestCache();
        for (const pa of ctx.params?.data?.protectedAreas || []) {
            await indexPark(pa?.id);
        }
    },
    afterUpdate: async (ctx) => {
        await clearRestCache();
        for (const pa of ctx.params?.data?.protectedAreas || []) {
            await indexPark(pa?.id);
        }
    },
    beforeUpdate: async (ctx) => {
        await indexParks(ctx);
    },
    beforeDelete: async (ctx) => {
        await indexParks(ctx);
    },
    afterDelete: async (ctx) => {
        await clearRestCache();
    },
    afterCreateMany: async (ctx) => {
        await clearRestCache();
    },
    afterUpdateMany: async (ctx) => {
        await clearRestCache();
    },
    afterDeleteMany: async (ctx) => {
        await clearRestCache();
    },
};

