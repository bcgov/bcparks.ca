"use strict";

/**
 * public advisory search service
 */

module.exports = ({ strapi }) => ({
  search: async (query) => {
    // Read the full matching set, sort once, then slice to keep pagination stable.
    const pagination = normalizePagination(query);
    query = buildQuery(stripPagination(query));
    query.sort = ["effectiveDate:DESC", "advisoryDate:DESC", "updatedDate:DESC", "id:DESC"];

    const results = await strapi
      .documents("api::public-advisory.public-advisory")
      .findMany(query);

    const sortedResults = [...results].sort(compareAdvisories);

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
  delete nextQuery._displaySort;

  return nextQuery;
};

// Derive the timestamp used for advisory display ordering.
const getDisplayTimestamp = (advisory) => {
  if (advisory.isEffectiveDateDisplayed && advisory.effectiveDate) {
    return Date.parse(advisory.effectiveDate) || 0;
  }

  if (advisory.isAdvisoryDateDisplayed && advisory.advisoryDate) {
    return Date.parse(advisory.advisoryDate) || 0;
  }

  if (advisory.isUpdatedDateDisplayed && advisory.updatedDate) {
    return Date.parse(advisory.updatedDate) || 0;
  }

  return Date.parse(advisory.updatedDate || advisory.advisoryDate) || 0;
};

// Keep ordering deterministic by applying date precedence, then stable tie-breakers.
const compareAdvisories = (a, b) => {
  // 1) Primary sort: displayed date precedence (effective, advisory, updated).
  const displayDateDiff = getDisplayTimestamp(b) - getDisplayTimestamp(a);
  if (displayDateDiff !== 0) {
    return displayDateDiff;
  }

  // 2) Tie-breaker: most recently updated advisory first.
  const updatedDateDiff =
    (Date.parse(b.updatedDate) || 0) - (Date.parse(a.updatedDate) || 0);
  if (updatedDateDiff !== 0) {
    return updatedDateDiff;
  }

  // 3) Tie-breaker: most recent advisory date first.
  const advisoryDateDiff =
    (Date.parse(b.advisoryDate) || 0) - (Date.parse(a.advisoryDate) || 0);
  if (advisoryDateDiff !== 0) {
    return advisoryDateDiff;
  }

  // 4) Final tie-breaker: higher id first for stable ordering.
  return (Number(b.id) || 0) - (Number(a.id) || 0);
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
