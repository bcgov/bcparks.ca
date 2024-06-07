"use strict";

/**
 * public-advisory controller
 */

const { sanitize } = require('@strapi/utils')
const { createCoreController } = require("@strapi/strapi").factories;

const populateStandardMessages = function (query) {
    if (query.populate !== "*") {
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

const appendStandardMessages = function (entity) {
    if (entity) {
        const { description = "", standardMessages } = entity;
        if (standardMessages && standardMessages.length > 0) {
            entity.description = (
                "<p>" + description + "</p>" +
                standardMessages.map((m) => m.description).join(" ")
            ).trim();
        }
    }
    return entity;
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

            ctx.query = populateStandardMessages(ctx.query);

            let entity = await strapi.service("api::public-advisory.public-advisory").findOne(entities[0].id, ctx.query);

            // append the standardMessages to the description and then delete them from the entity
            entity = appendStandardMessages(entity);
            delete entity.standardMessages;

            const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
            return sanitizedEntity;
        },
        async find(ctx) {
            let entities;
            let pagination;

            ctx.query = populateStandardMessages(ctx.query);

            if (ctx.query.queryText !== undefined) {
                ({ results: entities } = await strapi.service("api::public-advisory.search").search(ctx.query));
                pagination = {};
            } else {
                ({ results: entities, pagination } = await strapi.service("api::public-advisory.public-advisory").find(ctx.query));
            }

            const sanitizedEntities = await this.sanitizeOutput(entities, ctx);

            const results = sanitizedEntities.map((entity) => {
                entity = appendStandardMessages(entity);
                delete entity.standardMessages;
                return entity;
            });

            return {
                data: results || [],
                meta: { pagination: pagination }
            };
        },
        async count(ctx) {
            if (ctx.query.queryText !== undefined) {
                return await strapi.service("api::public-advisory.search").countSearch(ctx.query);
            }
            return (await strapi.service("api::public-advisory.public-advisory").find(ctx.query)).pagination.total;
        },
        async items(ctx) {
            let entities;
            let pagination;

            ctx.query.populate = {
                accessStatus: {
                    fields: [
                        "accessStatus",
                        "precedence",
                        "color",
                        "groupLabel",
                        "hidesSeasonalAdvisory"
                    ]
                },
                eventType: { fields: ["eventType", "precedence"] },
                urgency: { fields: ["urgency", "code", "sequence", "color"] },
                advisoryStatus: { fields: ["advisoryStatus", "code"] },
                links: { fields: '*' },
                standardMessages: { fields: '*' },
                sites: {
                    fields: ["orcsSiteNumber", "siteName"],
                    filters: { isDisplayed: true }
                }
            };

            ({ results: entities, pagination } = await strapi.service("api::public-advisory.public-advisory").find(ctx.query));

            const sanitizedEntities = await this.sanitizeOutput(entities, ctx);

            const results = sanitizedEntities.map((entity) => {
                entity = appendStandardMessages(entity);
                delete entity.standardMessages;
                return entity;
            });

            return {
                data: results || [],
                meta: { pagination: pagination }
            };
        },
        async getAccessStatusesByProtectedArea(ctx) {
            const entries = await strapi.entityService.findMany('api::public-advisory.public-advisory', {
                fields: ["id"],
                populate: {
                    accessStatus: { fields: ["id"] },
                    protectedAreas: { fields: ["id"] }
                },
                publicationState: "live"
            });
            const results = {};
            for (const advisory of entries) {
                for (const pa of advisory.protectedAreas) {
                    if (!results[pa.id]) {
                        results[pa.id] = [{ accessStatusId: advisory.accessStatus.id }]
                    } else {
                        if (!results[pa.id].find(x => x.accessStatusId === advisory.accessStatus?.id)) {
                            results[pa.id].push({ accessStatusId: advisory.accessStatus.id })
                        }
                    }
                }
            }
            return results;
        },
        async triggerScheduled(ctx) {

            const advisoryStatusMap = await strapi.service("api::public-advisory.scheduling").getAdvisoryStatusMap();
            const publishedCount = await strapi.service("api::public-advisory.scheduling").publish(advisoryStatusMap);
            const expiredCount = await strapi.service("api::public-advisory.scheduling").expire(advisoryStatusMap);
            const expiringSoonCount = await strapi.service("api::public-advisory.scheduling").expiringSoon(advisoryStatusMap);

            const cachePlugin = strapi.plugins["rest-cache"];
            if (cachePlugin && (publishedCount > 0 || expiredCount > 0)) {
                await cachePlugin.services.cacheStore.clearByUid('api::public-advisory.public-advisory');
            }

            ctx.send({
                message: `Scheduled public advisory processing complete. ${publishedCount} published. ${expiredCount} expired. ${expiringSoonCount} expiring soon.`
            }, 201);
        }
    })
);
