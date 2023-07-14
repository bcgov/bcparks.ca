"use strict";

/**
 * public-advisory service
 */

const { createCoreService } = require("@strapi/strapi").factories;

const buildQuery = function (query) {
    let textSearch = {};
    let typeSearch = {};

    if (query.queryText && query.queryText.length > 0) {
        if (query._searchType === "keyword") {
            textSearch = {
                $or: [
                    { title: { $containsi: query.queryText } },
                    { description: { $containsi: query.queryText } }
                ]
            };
        } else if (query._searchType === "park") {
            textSearch = { protectedAreas: { protectedAreaName: { $containsi: query.queryText } } };
        } else {
            textSearch = {
                $or: [
                    { title: { $containsi: query.queryText } },
                    { description: { $containsi: query.queryText } },
                    { protectedAreas: { protectedAreaName: { $containsi: query.queryText } } }
                ]
            };
        }
    }

    if (query._eventType && query._eventType.length > 0) {
        typeSearch = { eventType: { eventType: { $eq: query._eventType } } };
    }

    query.filters = {
        ...query.filters,
        ...{
            $and: [
                {
                    protectedAreas: {
                        publishedAt: { $null: false },
                        isDisplayed: { $eq: true }
                    }
                },
                ...[typeSearch],
                ...[textSearch]
            ]
        }
    };

    return query;
}

module.exports = createCoreService("api::public-advisory.public-advisory", ({ strapi }) => ({
    async search(query) {
        query = buildQuery(query);

        if (query.limit === undefined) {
            query.limit = query.pagination?.pageSize || 10;
        }

        if (query.start === undefined) {
            query.start = ((query.pagination?.page || 1) - 1) * query.limit;
        }

        query.sort = ["advisoryDate:DESC"];

        const results = await strapi.entityService.findMany("api::public-advisory.public-advisory", query);
        return { results: results };
    },
    async countSearch(query) {
        query = buildQuery(query);
        query.fields = ["id"];
        const results = await strapi.entityService.findMany("api::public-advisory.public-advisory", query);
        return results.length;
    },
})
);

