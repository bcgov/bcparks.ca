"use strict";

const { indexPark } = require("../../../../helpers/taskQueue.js");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const indexParks = async function (ctx) {
    let { where } = ctx.params;
    const advisory = await strapi.entityService.findOne(
        "api::public-advisory.public-advisory", where.id, {
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
        for (const pa of ctx.result?.protectedAreas || []) {
            await indexPark(pa?.id);
        }
    },
    afterUpdate: async (ctx) => {
        await clearRestCache();
        for (const pa of ctx.result?.protectedAreas || []) {
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
