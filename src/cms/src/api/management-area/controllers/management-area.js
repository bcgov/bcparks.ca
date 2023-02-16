"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::management-area.management-area", ({ strapi }) => ({
    async findOne(ctx) {
        const { id } = ctx.params;
        const { query } = ctx;
 
        const entity = await strapi.service('api::management-area.management-area').findOne(id, query);
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    
        return this.transformResponse(sanitizedEntity);
    },
}));
