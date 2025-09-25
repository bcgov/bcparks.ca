"use strict";

/*
 This migration is designed to work in localdev, alpha-dev, and alpha-test
 environments where the column names are currently incorrect and migrations
 23 and 24 have already been applied, ensuring that data in the columns is
 preserved. The renameColumn commands will only execute if the old column
 names exist, so in environments where the correct names are already present,
 these commands will be skipped.

 I realized after I wrote this that it has very limited use and only on
 specific environments, but I kept it anyway because it's a good example of
 how to rename columns and preserve data. In order for this pattern to work,
 the schema.json files for the affected content types should be updated in the
 same commit.
*/

module.exports = {
  async up(knex) {
    // Rename "park_area" to "park_area_name" in park_areas table
    if (await knex.schema.hasColumn("park_areas", "park_area")) {
      await knex.schema.table("park_areas", (table) => {
        table.renameColumn("park_area", "park_area_name");
      });
    }

    // Rename "name" to "park_area_type" in park_area_types table
    if (await knex.schema.hasColumn("park_area_types", "name")) {
      await knex.schema.table("park_area_types", (table) => {
        table.renameColumn("name", "park_area_type");
      });
    }
  },
};
