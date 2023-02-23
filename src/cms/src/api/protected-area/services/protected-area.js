"use strict";

/**
 * protected-area service
 */

const { createCoreService } = require("@strapi/strapi").factories;

const TEXT_SIMILARITY_THRESHOLD = 0.15;

module.exports = createCoreService("api::protected-area.protected-area", ({ strapi }) =>  ({
  async items() {
    const results = await strapi.db.query('api::protected-area.protected-area').findMany(
      {
        select: ["id", "orcs", "protectedAreaName"],
        limit: -1,
        orderBy: ['protectedAreaName'],
      }
    );
    return results;
  },
  // custom route for park id and name only
  async names() {
    let entities = await strapi.db.query('api::protected-area.protected-area')
  // TODO
    return entities;
  },
  async search() {
    const db = strapi.db;
    const metadata = db.metadata.get('api::protected-area.protected-area');
    // TODO:
    return [];
  },

  async setTextSimilarity(knex) {
    // TODO:
    return null
  },
  /* Apply where clauses to the query given */
  async applyQueryFilters() {
    // TODO
    return ''
  },
}));
