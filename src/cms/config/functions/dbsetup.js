"use strict";

/* Creates a generated searchtext column on protected_areas, if it doesn't already exist */
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
  } catch (err) {
    strapi.log.error(err);
  }
};

module.exports = async () => {
  await createSearchIndexes();
};
