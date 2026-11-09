"use strict";

const TABLES = ["protected_areas", "sites"];

module.exports = {
  /**
   * Renames location_notes to location_description on protected_areas and sites before Strapi syncs the updated schemas.
   * @param {import("knex").Knex} knex - The configured database connection.
   * @returns {Promise<void>} Resolves when the columns have been renamed.
   */
  async up(knex) {
    for (const tableName of TABLES) {
      if (
        (await knex.schema.hasTable(tableName)) &&
        (await knex.schema.hasColumn(tableName, "location_notes")) &&
        !(await knex.schema.hasColumn(tableName, "location_description"))
      ) {
        await knex.schema.table(tableName, (table) => {
          table.renameColumn("location_notes", "location_description");
        });
      }
    }
  },
};
