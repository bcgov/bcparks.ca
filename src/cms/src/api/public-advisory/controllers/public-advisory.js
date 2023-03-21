"use strict";

/**
 * public-advisory controller
 */

const { sanitize } = require('@strapi/utils')
const { createCoreController } = require("@strapi/strapi").factories;

const addStandardMessages = function (query) {
    if (query.populate !== "*" && query.populate !== "deep") {
        query = {
            ...query,
            ...{
                populate: {
                    ...query.populate,
                    ...{
                        "standardMessages": { "fields": ["title", "description"] },
                    }
                }
            }
        };
    }
    return query;
}

module.exports = createCoreController(
    "api::public-advisory.public-advisory",
    ({ strapi }) => ({
        async findOne(ctx) {

            const { id } = ctx.params;

            // look up the public advisory id by the advisory number
            const entities = await strapi.entityService.findMany("api::public-advisory.public-advisory", {
                filters: { advisoryNumber: id },
                fields: ["id"]
            });

            if (entities.length === 0) {
                return ctx.badRequest(404);
            }

            ctx.query = addStandardMessages(ctx.query);

            const entity = await strapi.service("api::public-advisory.public-advisory").findOne(entities[0].id, ctx.query);

            // append the standardMessages to the description and then delete them from the entity
            if (entity) {
                const { description = "", standardMessages } = entity;
                if (standardMessages && standardMessages.length > 0) {
                    entity.description = (
                        description +
                        " " +
                        standardMessages.map((m) => m.description).join(" ")
                    ).trim();
                }
            }
            delete entity.standardMessages;

            const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
            return sanitizedEntity;
        },
        async find(ctx) {
            let entities;
            let pagination;

            ctx.query = addStandardMessages(ctx.query);

            if (ctx.query._q !== undefined) {
                ({ results: entities } = await strapi.service("api::public-advisory.public-advisory").search(ctx.query));
                pagination = {};
            } else {
                ({ results: entities, pagination } = await strapi.service("api::public-advisory.public-advisory").find(ctx.query));
            }

            const sanitizedEntities = await this.sanitizeOutput(entities, ctx);

            const results = sanitizedEntities.map((publicAdvisory) => {
                if (publicAdvisory) {
                    const { description = "", standardMessages } = publicAdvisory;
                    if (standardMessages.length > 0) {
                        publicAdvisory.description = (
                            description +
                            " " +
                            standardMessages.map((m) => m.description).join(" ")
                        ).trim();
                    }
                }
                delete publicAdvisory.standardMessages;
                return publicAdvisory;
            });

            return {
                data: results || [],
                meta: { pagination: pagination }
            };
        },
        async count(ctx) {
            if (ctx.query._q !== undefined) {
                return await strapi.service("api::public-advisory.public-advisory").countSearch(ctx.query);
            }
            return (await strapi.service("api::public-advisory.public-advisory").find(ctx.query)).pagination.total;
        },
    }
    )
);
