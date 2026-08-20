"use strict";

const { orderBy } = require("lodash");

/**
 * public advisory search service
 */

module.exports = ({ strapi }) => ({
  search: async (query) => {
    // Only apply active-advisory date sorting when the request flag is enabled.
    const isActiveAdvisorySort = query._activeAdvisorySort === "1";

    const pagination = normalizePagination(query);
    query = buildQuery(stripPagination(query));

    // If custom active-advisory sorting is enabled, fetch all matching results and apply a final in-memory sort.
    if (isActiveAdvisorySort) {
      // Apply a coarse DB sort before the final in-memory sorting.
      query.sort = ["updatedDate:DESC", "advisoryDate:DESC", "id:DESC"];

      const results = await strapi
        .documents("api::public-advisory.public-advisory")
        .findMany(query);

      // Sort the full result set before slicing for pagination.
      const sortedResults = orderBy(
        results,
        [getSortTimestamp, "id"],
        ["desc", "desc"],
      );

      return {
        results: sortedResults.slice(
          pagination.start,
          pagination.start + pagination.limit,
        ),
        pagination: {
          page: Math.floor(pagination.start / pagination.limit) + 1,
          pageSize: pagination.limit,
          pageCount: Math.ceil(sortedResults.length / pagination.limit),
          total: sortedResults.length,
        },
      };
    }

    // If active-advisory sorting is not enabled, rely on DB sorting and pagination.
    query.limit = pagination.limit;
    query.start = pagination.start;
    query.sort = ["advisoryDate:DESC", "updatedDate:DESC", "id:DESC"];

    const results = await strapi
      .documents("api::public-advisory.public-advisory")
      .findMany(query);
    return { results: results };
  },
  countSearch: async (query) => {
    // Count against the same filtered set used by search, without paging controls.
    query = buildQuery(stripPagination(query));
    query.fields = ["id"];
    const results = await strapi
      .documents("api::public-advisory.public-advisory")
      .findMany(query);
    return results.length;
  },
});

// Safely parse integer-like values from query params.
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

// Normalize Strapi pagination inputs (limit/start or pagination.*) into one shape.
const normalizePagination = (query) => {
  const directLimit = toInteger(query.limit);
  const directStart = toInteger(query.start);
  const paginationLimit = toInteger(query.pagination?.limit);
  const paginationPageSize = toInteger(query.pagination?.pageSize);
  const paginationStart = toInteger(query.pagination?.start);
  const paginationPage = toInteger(query.pagination?.page);

  let limit = 10;
  if (directLimit > 0) {
    limit = directLimit;
  } else {
    if (paginationLimit > 0) {
      limit = paginationLimit;
    } else {
      if (paginationPageSize > 0) {
        limit = paginationPageSize;
      }
    }
  }

  let start;
  if (directStart >= 0) {
    start = directStart;
  } else {
    if (paginationStart >= 0) {
      start = paginationStart;
    } else {
      const safePage = paginationPage >= 1 ? paginationPage : 1;
      start = (safePage - 1) * limit;
    }
  }

  return { limit, start };
};

// Remove request controls that should not be passed to the DB query layer.
const stripPagination = (query) => {
  const nextQuery = { ...query };

  delete nextQuery.limit;
  delete nextQuery.start;
  delete nextQuery.sort;
  delete nextQuery.pagination;
  delete nextQuery._activeAdvisorySort;

  return nextQuery;
};

// Resolves the active-advisory sort timestamp as updatedDate, or advisoryDate when updatedDate is missing.
const getSortTimestamp = (advisory) => {
  return Date.parse(advisory.updatedDate || advisory.advisoryDate) || 0;
};

// Build shared filters/populate for public advisory search requests.
const buildQuery = function (query) {
  let textSearch = {};
  let typeSearch = {};

  if (query.queryText && query.queryText.length > 0) {
    if (query._searchType === "keyword") {
      textSearch = {
        $or: [
          { title: { $containsi: query.queryText } },
          { description: { $containsi: query.queryText } },
        ],
      };
    } else if (query._searchType === "park") {
      textSearch = {
        protectedAreas: { protectedAreaName: { $containsi: query.queryText } },
      };
    } else {
      textSearch = {
        $or: [
          { title: { $containsi: query.queryText } },
          { description: { $containsi: query.queryText } },
          {
            protectedAreas: {
              protectedAreaName: { $containsi: query.queryText },
            },
          },
        ],
      };
    }
  }

  if (query._eventType && query._eventType.length > 0) {
    typeSearch = {
      eventType: { eventType: { $startsWith: query._eventType } },
    };
  }

  query.status = "published";

  query.filters = {
    ...query.filters,
    ...{
      $and: [
        {
          protectedAreas: {
            publishedAt: { $null: false },
            isDisplayed: { $eq: true },
          },
        },
        ...[typeSearch],
        ...[textSearch],
      ],
    },
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
      fields: [
        "protectedAreaName",
        "slug",
        "isDisplayed",
        "publishedAt",
        "orcs",
      ],
      filters: {
        publishedAt: { $null: false },
        isDisplayed: { $eq: true },
      },
    },
    regions: true,
    sections: true,
    sites: {
      fields: [
        "siteName",
        "slug",
        "isDisplayed",
        "publishedAt",
        "orcsSiteNumber",
      ],
      filters: {
        publishedAt: { $null: false },
        isDisplayed: { $eq: true },
      },
    },
    standardMessages: true,
    urgency: true,
  };

  return query;
};
