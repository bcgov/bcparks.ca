"use strict";

/**
 * facility-type controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
    "api::facility-type.facility-type",
    ({ strapi }) => ({
        async update(ctx) {
            strapi.plugins[
                "rest-cache"
            ].services.cacheConfig.clearByUid('api::protected-area.protected-area')
            const response = await super.update(ctx);
            return response;
        }
    })
);