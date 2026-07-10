'use strict';

/**
 * public advisory search service
 */

module.exports = ({ strapi }) => ({

  search: async (query) => {
    query = buildQuery(query);

    const toInteger = (value) => {
      if (value === undefined || value === null) {
        return undefined;
      }

      if (typeof value === "string" && value.trim() === "") {
        return undefined;
      }

      const numericValue = Number(value);
      return Number.isInteger(numericValue) ? numericValue : undefined;
    };

    const directLimit = toInteger(query.limit);
    const directStart = toInteger(query.start);
    const paginationLimit = toInteger(query.pagination?.limit);
    const paginationPageSize = toInteger(query.pagination?.pageSize);
    const paginationStart = toInteger(query.pagination?.start);
    const paginationPage = toInteger(query.pagination?.page);

    if (directLimit > 0) {
      query.limit = directLimit;
    } else {
      if (paginationLimit > 0) {
        query.limit = paginationLimit;
      } else if (paginationPageSize > 0) {
        query.limit = paginationPageSize;
      } else {
        query.limit = 10;
      }
    }

    if (directStart >= 0) {
      query.start = directStart;
    } else {
      if (paginationStart >= 0) {
        query.start = paginationStart;
      } else {
        const safePage = paginationPage >= 1 ? paginationPage : 1;
        query.start = (safePage - 1) * query.limit;
      }
    }

    query.sort = ["advisoryDate:DESC"];

    const results = await strapi.documents("api::public-advisory.public-advisory").findMany(query);
    return { results: results };
  },
  countSearch: async (query) => {
    query = buildQuery(query);
    query.fields = ["id"];
    const results = await strapi.documents("api::public-advisory.public-advisory").findMany(query);
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

  query.status = "published";

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
    protectedAreas: {
      fields: ["protectedAreaName", "slug", "isDisplayed", "publishedAt", "orcs"],
      filters: {
        publishedAt: { $null: false },
        isDisplayed: { $eq: true }
      }
    },
    regions: true,
    sections: true,
    sites: {
      fields: ["siteName", "slug", "isDisplayed", "publishedAt", "orcsSiteNumber"],
      filters: {
        publishedAt: { $null: false },
        isDisplayed: { $eq: true }
      }
    },
    standardMessages: true,
    urgency: true
  };

  return query;
};
