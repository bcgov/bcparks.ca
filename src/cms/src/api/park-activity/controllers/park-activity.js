"use strict";

/**
 * park-activity controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
    "api::park-activity.park-activity",
    ({ strapi }) => ({
        async update(ctx) {
            strapi.plugins[
                "rest-cache"
            ].services.cacheStore.clearByUid('api::protected-area.protected-area')
            const response = await super.update(ctx);
            return response;
        }
    })
);
