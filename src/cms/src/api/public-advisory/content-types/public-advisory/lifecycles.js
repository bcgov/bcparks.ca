"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

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
    },
    afterUpdate: async (ctx) => {
        await clearRestCache();
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
