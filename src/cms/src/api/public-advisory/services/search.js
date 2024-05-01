'use strict';

/**
 * public advisory search service
 */

module.exports = ({ strapi }) => ({

  search: async (query) => {
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
  countSearch: async (query) => {
    query = buildQuery(query);
    query.fields = ["id"];
    const results = await strapi.entityService.findMany("api::public-advisory.public-advisory", query);
    return results.length;
  },
});

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
    typeSearch = { eventType: { eventType: { $startsWith: query._eventType } } };
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

  query.populate = {
    accessStatus: true,
    advisoryStatus: true,
    eventType: true,
    fireCentres: true,
    fireZones: true,
    naturalResourceDistricts: true,
    links: true,
    managementAreas: true,
    protectedAreas: { fields: ["protectedAreaName", "slug", "isDisplayed", "publishedAt", "orcs"] },
    regions: true,
    sections: true,
    sites: { fields: ["siteName", "slug", "isDisplayed", "publishedAt", "orcsSiteNumber"] },
    standardMessages: true,
    urgency: true
  };

  return query;
};
