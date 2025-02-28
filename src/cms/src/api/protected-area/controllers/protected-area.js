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
    async findOne(ctx) {
      const { id } = ctx.params;
      // look up the protected area by the orcs
      const entities = await strapi.documents("api::protected-area.protected-area").findMany({
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