"use strict";

/**
 * protected-area controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const customStatus = require("../custom/protected-area-status");
const customSearch = require("../custom/protected-area-search");

module.exports = createCoreController(
  "api::protected-area.protected-area",
  ({ strapi }) => ({
    async find(ctx) {
      let entities;
      // if queryText is present in the query params, trigger search mode
      // which has some custom filters and ordering, and returns
      // extra data in the response
      if (typeof ctx.query.queryText !== "undefined") {
        const filters = parseSearchFilters(ctx.query);
        const ordering = parseSearchOrdering(ctx.query);
        const offset = parseSearchOffset(ctx.query);
        entities = await strapi
          .service("api::protected-area.protected-area").search({
            ...filters,
            ...ordering,
            ...offset,
          });
      } else {
        entities = await super.find(ctx);
      }

      const res = this.sanitizeOutput(entities, ctx);
      //TODO: ( for the gatsby 4)  transformResponse - If we need to add attributese
      // entities = this.transformResponse(entities)
      return res;
    },
    async count(ctx) {
      // if queryText is present in the query params, trigger search mode
      // which has some custom filters and ordering, and returns
      // extra data in the response
      if (typeof ctx.query.queryText !== "undefined") {
        const filters = parseSearchFilters(ctx.query);
        return await strapi
          .service("api::protected-area.protected-area")
          .countSearch({
            ...filters,
          });
      }
      return await strapi
        .query("api::protected-area.protected-area")
        .count(ctx.query);
    },
    async findOne(ctx) {
      const { id } = ctx.params;
      // look up the protected area by the orcs
      const entities = await strapi.entityService.findMany("api::protected-area.protected-area", {
        filters: { orcs: id },
        fields: ["id"]
      });
      if (entities.length === 0) {
        return ctx.badRequest(404);
      }
      let entity = await strapi.service("api::protected-area.protected-area").findOne(entities[0].id, ctx.query);
      return await this.sanitizeOutput(entity, ctx);
    },

    async items() {
      // custom route for light weight park details used in client app
      const entities = await strapi
        .service("api::protected-area.protected-area")
        .items();
      return entities.map((entity) => {
        const { id, orcs, protectedAreaName } = entity;
        return { id, orcs, protectedAreaName };
      });
    },

    async status(ctx) {
      return customStatus.getProtectedAreaStatus(ctx);
    },

    async searchParks(ctx) {
      return await customSearch.searchParks(ctx);
    },

    async autocomplete(ctx) {
      return await customSearch.parkAutocomplete(ctx);
    }
  })
);

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
