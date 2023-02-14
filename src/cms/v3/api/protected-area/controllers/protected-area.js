"use strict";
const { sanitizeEntity } = require("strapi-utils");
const customStatus = require("../custom/protected-area-status");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    let entities;
    // if _q is present in the query params, trigger search mode
    // which has some custom filters and ordering, and returns
    // extra data in the response
    if (typeof ctx.query._q !== "undefined") {
      const filters = parseSearchFilters(ctx.query);
      const ordering = parseSearchOrdering(ctx.query);
      const offset = parseSearchOffset(ctx.query);
      entities = await strapi.services["protected-area"].search({
        ...filters,
        ...ordering,
        ...offset,
      });
    } else {
      entities = await strapi.services["protected-area"].find(ctx.query);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.contentTypes["protected-area"] })
    );
  },
  async count(ctx) {
    // if _q is present in the query params, trigger search mode
    // which has some custom filters and ordering, and returns
    // extra data in the response
    if (typeof ctx.query._q !== "undefined") {
      const filters = parseSearchFilters(ctx.query);
      return await strapi.services["protected-area"].countSearch({
        ...filters,
      });
    }
    return await strapi.services["protected-area"].count(ctx.query);
  },
  async findOne(ctx) {
    const { orcs } = ctx.params;
    const entity = await strapi.services["protected-area"].findOne({ orcs });
    return sanitizeEntity(entity, {
      model: strapi.contentTypes["protected-area"],
    });
  },
  async names(ctx) {
    // custom route for basic park details with park names
    const parkNamesData = await strapi.services["park-name"].names();
    const entities = await strapi.services["protected-area"].names(ctx);
    return entities.map((entity) => {
      const { id, orcs, type, typeCode, protectedAreaName } = sanitizeEntity(
        entity,
        {
          model: strapi.contentTypes["protected-area"],
        }
      );
      const parkNamesFilter = parkNamesData.filter((x) => x.orcs == orcs);

      const parkNames =
        parkNamesFilter.length !== 0 ? parkNamesFilter[0].parkNames : [];

      return { id, orcs, type, typeCode, protectedAreaName, parkNames };
    });
  },
  async items() {
    // custom route for light weight park details used in client app
    const entities = await strapi.services["protected-area"].items();
    return entities.map((entity) => {
      const { id, orcs, protectedAreaName } = sanitizeEntity(entity, {
        model: strapi.contentTypes["protected-area"],
      });
      return { id, orcs, protectedAreaName };
    });
  },
  async status(ctx) {
    return customStatus.getProtectedAreaStatus(ctx);
  },
};

function parseSearchFilters(query) {
  const searchText = query._q;
  const typeCode = query.typeCode || query.typeCode_eq;
  const accessStatus = query.accessStatus || query.accessStatus_eq;
  const marineProtectedArea =
    query.marineProtectedArea || query.marineProtectedArea_eq;
  const camping =
    query.camping &&
    (query.camping.toLowerCase() === "true" ||
      query.camping.toLowerCase() === "y");

  let activityTypeIds = [];
  let facilityTypeIds = [];

  if (query.activities) {
    if (typeof query.activities === "object") {
      activityTypeIds = query.activities.map((activityId) =>
        parseInt(activityId, 10)
      );
    } else {
      activityTypeIds = [parseInt(query.activities, 10)];
    }
  }
  if (query.facilities) {
    if (typeof query.facilities === "object") {
      facilityTypeIds = query.facilities.map((facilityId) =>
        parseInt(facilityId, 10)
      );
    } else {
      facilityTypeIds = [parseInt(query.facilities, 10)];
    }
  }

  return {
    searchText,
    typeCode,
    accessStatus,
    camping,
    marineProtectedArea,
    activityTypeIds,
    facilityTypeIds,
  };
}

function parseSearchOrdering(query) {
  let sortCol, sortDesc;
  if (query._sort === "protectedAreaName:desc") {
    sortCol = "protectedAreaName";
    sortDesc = true;
  } else if (query._sort === "protectedAreaName:asc") {
    sortCol = "protectedAreaName";
    sortDesc = false;
  } else {
    sortCol = "rank";
    sortDesc = true;
  }

  return {
    sortCol,
    sortDesc,
  };
}

function parseSearchOffset(query) {
  const offset = parseInt(query._start, 10) || 0;
  const limit = parseInt(query._limit, 10) || 6;

  return {
    limit,
    offset,
  };
}
