"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  // async bootstrap(/*{ strapi }*/) {
  //   const createSearchIndexes = async () => {
  //     try {
  //       const knex = strapi.db.connection;
  //
  //       // Index setup is postgresql specific
  //       if (knex.client.config.client !== "postgres") {
  //         return;
  //       }
  //
  //       const hasSearchColumn = await knex.schema.hasColumn(
  //         "protected_areas",
  //         "search_text"
  //       );
  //
  //       if (!hasSearchColumn) {
  //         await knex.schema.raw(
  //           `ALTER TABLE protected_areas
  //                 ADD COLUMN search_text tsvector GENERATED ALWAYS AS (
  //                     setweight(to_tsvector('english', ("protected_area_name")), 'A') || ' ' ||
  //                     setweight(to_tsvector('english', ("location_notes")), 'C') || ' ' ||
  //                     setweight(to_tsvector('english', ("description")), 'D') || ' '::tsvector
  //                 ) STORED`
  //         );
  //       }
  //
  //       const indexes = await knex("pg_indexes")
  //         .select("indexname")
  //         .where("schemaname", "public")
  //         .andWhere("tablename", "IN", [
  //           "protected_areas",
  //           "park_activities",
  //           "park_facilities",
  //           "park_names",
  //           "public_advisories",
  //         ]);
  //
  //       if (
  //         !indexes.find(
  //           (index) => index.indexname === "protected_areas_search_idx"
  //         )
  //       ) {
  //         await knex.schema.raw(
  //           "CREATE INDEX protected_areas_search_idx ON protected_areas USING gin(search_text)"
  //         );
  //       }
  //
  //       if (
  //         !indexes.find(
  //           (index) => index.indexname === "activity_desc_search_idx"
  //         )
  //       ) {
  //         await knex.schema.raw(
  //           "CREATE INDEX activity_desc_search_idx ON park_activities USING gin(setweight(to_tsvector('english', description), 'D'))"
  //         );
  //       }
  //
  //       if (
  //         !indexes.find(
  //           (index) => index.indexname === "facility_desc_search_idx"
  //         )
  //       ) {
  //         await knex.schema.raw(
  //           "CREATE INDEX facility_desc_search_idx ON park_facilities USING gin(setweight(to_tsvector('english', description), 'D'))"
  //         );
  //       }
  //
  //       const hasAdvisorySearchColumn = await knex.schema.hasColumn(
  //         "public_advisories",
  //         "search_text"
  //       );
  //
  //       if (!hasAdvisorySearchColumn) {
  //         await knex.schema.raw(
  //           `ALTER TABLE public_advisories
  //                 ADD COLUMN search_text tsvector GENERATED ALWAYS AS (
  //                     setweight(to_tsvector('english', (title)), 'A') || ' ' ||
  //                     setweight(to_tsvector('english', (description)), 'C') || ' '::tsvector
  //                 ) STORED`
  //         );
  //       }
  //
  //       // Enable pg_trgm and set up trigram indexes to catch misspelled park names
  //       const hasTrgmExtension = await knex
  //         .select("oid")
  //         .from("pg_extension")
  //         .where("extname", "pg_trgm")
  //         .first();
  //       if (!hasTrgmExtension) {
  //         await knex.schema.raw('CREATE EXTENSION "pg_trgm"');
  //       }
  //
  //       if (
  //         !indexes.find((index) => index.indexname === "park_names_trgm_idx")
  //       ) {
  //         await knex.schema.raw(
  //           'CREATE INDEX park_names_trgm_idx ON park_names USING gin ("park_name" gin_trgm_ops)'
  //         );
  //       }
  //
  //       if (
  //         !indexes.find(
  //           (index) => index.indexname === "protected_area_name_trgm_idx"
  //         )
  //       ) {
  //         await knex.schema.raw(
  //           'CREATE INDEX protected_area_name_trgm_idx ON protected_areas USING gin ("protected_area_name" gin_trgm_ops)'
  //         );
  //       }
  //
  //       if (
  //         !indexes.find(
  //           (index) => index.indexname === "public_advisories_title_trgm_idx"
  //         )
  //       ) {
  //         await knex.schema.raw(
  //           "CREATE INDEX public_advisories_title_trgm_idx ON public_advisories USING gin (title gin_trgm_ops)"
  //         );
  //       }
  //     } catch (err) {
  //       strapi.log.error(err);
  //     }
  //   };
  //   await createSearchIndexes();
  // },
};
