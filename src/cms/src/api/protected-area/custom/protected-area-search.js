"use strict";


const searchParks = async function (ctx) {

  const filters = parseSearchFilters(ctx.query);
  const offset = parseSearchOffset(ctx.query);

  try {
    const resp = await strapi.service("api::protected-area.search").searchParks({
      ...filters,
      ...offset,
    });

    const result = resp?.body?.hits;

    if (result?.hits) {
      const filteredMatches = result.hits;

      const data = filteredMatches.map((data) => {
        return data['_source'];
      });

      return {
        data: data,
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: Math.ceil(result.total?.value / 10),
            total: result.total?.value
          },
          aggregations: cleanUpAggregations(resp?.body?.aggregations)
        }
      };
    }
    else {
      ctx.body = {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 0,
            total: 0
          },
          aggregations: {}
        }
      }
    }
  } catch (err) {
    ctx.response.status = 500;
    ctx.body = "An error was encountered while processing the search request."
    console.log('An error was encountered while processing the search request.')
    console.log(err);
  }
};

const parkAutocomplete = async function (ctx) {
  try {
    const resp = await strapi.service("api::protected-area.search").parkAutocomplete({
      searchText: (ctx.query.queryText || '').trim(),
    });

    const result = resp?.body?.hits;

    if (result?.hits) {
      const filteredMatches = result.hits;

      const data = filteredMatches.map((data) => {
        return data['_source'];
      });

      return {
        data: data,
      };
    }
    else {
      ctx.body = {
        data: [],
      }
    }
  } catch (err) {
    ctx.response.status = 500;
    ctx.body = "An error was encountered while processing the search request."
    console.log(`An error was encountered by search autocomplete: ${ctx.query.queryText}`)
    console.log(err);
  }
};

function parseSearchFilters(query) {
  const searchText = query.queryText;
  const typeCode = query.typeCode || query.typeCode_eq;
  const accessStatus = query.accessStatus || query.accessStatus_eq;
  const marineProtectedArea =
    query.marineProtectedArea || query.marineProtectedArea_eq;
  const camping =
    query.camping &&
    (query.camping.toLowerCase() === "true" ||
      query.camping.toLowerCase() === "y");

  let activityNumbers = [];
  let facilityNumbers = [];
  let regionNumbers = [];

  if (query.activities) {
    if (typeof query.activities === "object") {
      activityNumbers = query.activities.map((activity) =>
        parseInt(activity, 10)
      );
    } else {
      activityNumbers = [parseInt(query.activities, 10)];
    }
  }
  if (query.facilities) {
    if (typeof query.facilities === "object") {
      facilityNumbers = query.facilities.map((facility) =>
        parseInt(facility, 10)
      );
    } else {
      facilityNumbers = [parseInt(query.facilities, 10)];
    }
  }
  if (query.regions) {
    if (typeof query.regions === "object") {
      regionNumbers = query.regions.map((region) =>
        parseInt(region, 10)
      );
    } else {
      regionNumbers = [parseInt(query.regions, 10)];
    }
  }

  return {
    searchText,
    typeCode,
    accessStatus,
    camping,
    marineProtectedArea,
    activityNumbers,
    facilityNumbers,
    regionNumbers
  };
}

function parseSearchOffset(query) {
  const offset = parseInt(query._start, 10) || 0;
  const limit = parseInt(query._limit, 10) || 10;

  return {
    limit,
    offset,
  };
}

function cleanUpAggregations(aggs) {
  aggs.regions = aggs.all_regions.filtered.regions;
  delete aggs.all_regions;
  return aggs;
}

module.exports = {
  parkAutocomplete,
  searchParks
};

