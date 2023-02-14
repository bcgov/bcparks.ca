"use strict";

/* Creates indexes required for search:
 *  - a generated search text column on protected_areas
 *  - a gin search text index on park_activities.description
 *  - a gin search text index on park_facilities.description
 *  - a trigram index on protected_area names
 *  - a trigram index on park_names
 *
 * Also enables the pg_trgm extension.
 * Before each operation, check to see if it has already been done.
 */
const createSearchIndexes = async () => {
  try {
    const knex = strapi.connections[strapi.config.database.defaultConnection];

    // Index setup is postgresql specific
    if (knex.client.config.client !== "pg") {
      return;
    }

    const hasSearchColumn = await knex.schema.hasColumn(
      "protected_areas",
      "search_text"
    );

    if (!hasSearchColumn) {
      await knex.schema.raw(
        `ALTER TABLE protected_areas
              ADD COLUMN search_text tsvector GENERATED ALWAYS AS (    
                  setweight(to_tsvector('english', ("protectedAreaName")), 'A') || ' ' ||
                  setweight(to_tsvector('english', ("locationNotes")), 'C') || ' ' ||
                  setweight(to_tsvector('english', ("description")), 'D') || ' '::tsvector
              ) STORED`
      );
    }

    const indexes = await knex("pg_indexes")
      .select("indexname")
      .where("schemaname", "public")
      .andWhere("tablename", "IN", [
        "protected_areas",
        "park_activities",
        "park_facilities",
        "park_names",
        "public_advisories",
      ]);

    if (
      !indexes.find((index) => index.indexname === "protected_areas_search_idx")
    ) {
      await knex.schema.raw(
        "CREATE INDEX protected_areas_search_idx ON protected_areas USING gin(search_text)"
      );
    }

    if (
      !indexes.find((index) => index.indexname === "activity_desc_search_idx")
    ) {
      await knex.schema.raw(
        "CREATE INDEX activity_desc_search_idx ON park_activities USING gin(setweight(to_tsvector('english', description), 'D'))"
      );
    }

    if (
      !indexes.find((index) => index.indexname === "facility_desc_search_idx")
    ) {
      await knex.schema.raw(
        "CREATE INDEX facility_desc_search_idx ON park_facilities USING gin(setweight(to_tsvector('english', description), 'D'))"
      );
    }

    const hasAdvisorySearchColumn = await knex.schema.hasColumn(
      "public_advisories",
      "search_text"
    );

    if (!hasAdvisorySearchColumn) {
      await knex.schema.raw(
        `ALTER TABLE public_advisories
              ADD COLUMN search_text tsvector GENERATED ALWAYS AS (    
                  setweight(to_tsvector('english', (title)), 'A') || ' ' ||
                  setweight(to_tsvector('english', (description)), 'C') || ' '::tsvector
              ) STORED`
      );
    }

    // Enable pg_trgm and set up trigram indexes to catch misspelled park names
    const hasTrgmExtension = await knex
      .select("oid")
      .from("pg_extension")
      .where("extname", "pg_trgm")
      .first();
    if (!hasTrgmExtension) {
      await knex.schema.raw('CREATE EXTENSION "pg_trgm"');
    }

    if (!indexes.find((index) => index.indexname === "park_names_trgm_idx")) {
      await knex.schema.raw(
        'CREATE INDEX park_names_trgm_idx ON park_names USING gin ("parkName" gin_trgm_ops)'
      );
    }

    if (
      !indexes.find(
        (index) => index.indexname === "protected_area_name_trgm_idx"
      )
    ) {
      await knex.schema.raw(
        'CREATE INDEX protected_area_name_trgm_idx ON protected_areas USING gin ("protectedAreaName" gin_trgm_ops)'
      );
    }

    if (
      !indexes.find(
        (index) => index.indexname === "public_advisories_title_trgm_idx"
      )
    ) {
      await knex.schema.raw(
        "CREATE INDEX public_advisories_title_trgm_idx ON public_advisories USING gin (title gin_trgm_ops)"
      );
    }
  } catch (err) {
    strapi.log.error(err);
  }
};

module.exports = async () => {
  await createSearchIndexes();
};
