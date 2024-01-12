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
        const parkResult = data['_source'];
        if (!isNaN(filters.latitude) && !isNaN(filters.longitude) && data["sort"]?.length > 0) {
          parkResult.distance = Math.round(data["sort"][0] * 1000) / 1000
        }
        return parkResult;
      });

      return {
        data: data,
        meta: {
          pagination: {
            start: offset.offset,
            limit: offset.limit,
            total: result.total?.value || 0
          },
          aggregations: offset.limit === 0
            ? {}
            : cleanUpAggregations(resp?.body?.aggregations)
        }
      };
    }
    else {
      ctx.body = {
        data: [],
        meta: {
          pagination: {
            start: 1,
            limit: 10,
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
  let campingNumbers = [];
  let areaNumbers = [];
  let latitude = NaN;
  let longitude = NaN;
  let radius = NaN;

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
  if (query.areas) {
    if (typeof query.areas === "object") {
      areaNumbers = query.areas.map((area) =>
        parseInt(area, 10)
      );
    } else {
      areaNumbers = [parseInt(query.areas, 10)];
    }
  }
  if (query.campings) {
    if (typeof query.campings === "object") {
      campingNumbers = query.campings.map((camping) =>
        parseInt(camping, 10)
      );
    } else {
      campingNumbers = [parseInt(query.campings, 10)];
    }
  }
  if (query.near && query.near.indexOf(",") !== -1) {
    const coords = query.near.split(",");
    latitude = +coords[0];
    longitude = +coords[1];
    // disable radius sorting for points way outside of BC
    // the API is probably being called incorrectly anyway
    if (latitude < 47 || latitude > 62) {
      latitude = NaN;
    }
    if (longitude < -135 || longitude > -112) {
      longitude = NaN;
    }
  }
  if (query.radius) {
    radius = parseInt(query.radius)
  }

  return {
    searchText,
    typeCode,
    accessStatus,
    camping,
    marineProtectedArea,
    activityNumbers,
    facilityNumbers,
    areaNumbers,
    campingNumbers,
    latitude,
    longitude,
    radius
  };
}

function parseSearchOffset(query) {
  const offset = parseInt(query._start, 10) || 0;
  let limit = parseInt(query._limit, 10);
  if (!limit && limit !== 0) {
    limit = 10
  }
  return {
    limit,
    offset,
  };
}

function cleanUpAggregations(aggs) {
  if (aggs === undefined) {
    aggs = {};
  }
  aggs.areas = aggs.all_areas?.filtered.areas;
  aggs.campings = aggs.all_camping?.filtered.campings;
  delete aggs.all_areas;
  delete aggs.all_camping;
  return aggs;
}

module.exports = {
  parkAutocomplete,
  searchParks
};

