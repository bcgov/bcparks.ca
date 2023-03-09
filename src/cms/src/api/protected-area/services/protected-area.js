"use strict";

/**
 * protected-area service
 */

const { createCoreService } = require("@strapi/strapi").factories;

const TEXT_SIMILARITY_THRESHOLD = 0.3;

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

  /*
   * Park search handling
   *
   * Protected area search is used for the main parks search page on the frontend.
   * It uses some complex filters and Postgres full text search to achieve this.
   *
   * Full text indexes and the search_text column are created automatically during
   * bootstrap.
   */
  async search({
    searchText,
    typeCode,
    camping,
    marineProtectedArea,
    activityTypeIds,
    facilityTypeIds,
    sortCol,
    sortDesc,
    limit,
    offset,
  }) {
    const knex = strapi.db.connection;

    // If we have some search text for full text search, drop the similarity threshold
    // Default is 0.3 which misses basic misspellings
    if (searchText) {
      await this.setTextSimilarity(knex);
    }

    // const applyFilters = this.applyQueryFilters;

    const query = knex
      .select("protected_areas.id",
        "protected_areas.protected_area_name AS protectedAreaName",
        "protected_areas.slug",
        knex.raw(
          `array(
            SELECT to_json((
              SELECT j FROM (
                SELECT adv."id", 
                public_advisories_urgency_links.urgency_id, 
                public_advisories_advisory_status_links.advisory_status_id
              ) j
            ))
            FROM protected_areas_advisories_links
            INNER JOIN public_advisories adv
              ON adv.id = protected_areas_advisories_links.public_advisory_id
            INNER JOIN public_advisories_urgency_links 
              ON adv.id = public_advisories_urgency_links.public_advisory_id
            INNER JOIN public_advisories_advisory_status_links
              ON adv.id = public_advisories_advisory_status_links.public_advisory_id
            WHERE protected_areas_advisories_links.protected_area_id = protected_areas.id
              AND adv.published_at IS NOT NULL
          ) AS "advisories"`
        ),
        knex.raw(
          `array(
            SELECT thumbnail_url
            FROM park_photos
            WHERE park_photos.orcs = protected_areas.orcs
                AND park_photos.published_at IS NOT NULL
                AND park_photos.is_active = TRUE
                AND park_photos.thumbnail_url IS NOT NULL
            ORDER BY park_photos.is_featured DESC NULLS LAST,
                park_photos.sort_order ASC NULLS LAST,
                park_photos.date_taken DESC,
                park_photos.id DESC
            LIMIT 5
          ) AS "parkPhotos"`
        ),
        knex.raw(
          `EXISTS(
            SELECT 1 FROM park_operations
            INNER JOIN park_operations_protected_area_links
              ON park_operations.id = park_operations_protected_area_links.park_operation_id
            WHERE park_operations_protected_area_links.protected_area_id = protected_areas.id
              AND park_operations.published_at IS NOT NULL
              AND has_reservations = TRUE
          ) AS "hasReservations"`
        )
      )
      .from("protected_areas");

    query.orderBy("protectedAreaName", "ASC");

    query.limit(limit);
    query.offset(offset);

    return await query;
  },

  async setTextSimilarity(knex) {
    // If we have some search text for full text search, drop the similarity threshold
    // Default is 0.3 which misses basic misspellings
    return await knex.raw("SET pg_trgm.similarity_threshold = ??", [
      TEXT_SIMILARITY_THRESHOLD,
    ]);
  },
  /* Apply where clauses to the query given */
  async applyQueryFilters() {
    // TODO
    return ''
  },
}));
