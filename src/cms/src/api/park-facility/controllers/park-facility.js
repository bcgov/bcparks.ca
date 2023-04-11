"use strict";

/**
 * park-facility controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
    "api::park-facility.park-facility",
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
