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
    // find a protected area by ORCS number
    // overrides default findOne to use ORCS as the identifier instead of documentId
    async findOne(ctx) {
      const { id } = ctx.params;

      const entity = await strapi
        .documents("api::protected-area.protected-area")
        .findFirst({
          filters: { orcs: id },
          ...ctx.query,
        });
      if (!entity) {
        return ctx.notFound();
      }

      return await this.sanitizeOutput(entity, ctx);
    },

    // get lightweight list of all protected areas
    // returns only id, orcs, and protectedAreaName for client app
    async items() {
      const entities = await strapi
        .documents("api::protected-area.protected-area")
        .findMany({
          fields: ["id", "documentId", "orcs", "protectedAreaName"],
          limit: 2000,
        });

      return entities.map((entity) => {
        const { id, documentId, orcs, protectedAreaName } = entity;
        return { id, documentId, orcs, protectedAreaName };
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
    },
  }),
);
