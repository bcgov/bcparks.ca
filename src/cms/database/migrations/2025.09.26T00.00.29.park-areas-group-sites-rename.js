"use strict";

/*
 Renames the "group_site" column to "group_sites" in the "park_areas"
 table. This migration only affects environments where the column is
 incorrectly named "group_site". If the column already has the correct
 name, no changes will be made.
*/

module.exports = {
  async up(knex) {
    if (await knex.schema.hasColumn("park_areas", "group_site")) {
      await knex.schema.table("park_areas", (table) => {
        table.renameColumn("group_site", "group_sites");
      });
    }
  },
};
