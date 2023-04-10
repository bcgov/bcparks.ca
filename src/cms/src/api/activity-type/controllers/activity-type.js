"use strict";

/**
 * activity-type controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
    "api::activity-type.activity-type",
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
