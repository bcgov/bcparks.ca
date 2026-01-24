"use strict";

/**
 * Renames the "status" column to "statusCode" in the "protected_areas"
 * and "sites" tables. This migration only affects environments
 * where the column is currently named "status". If the column
 * already has the correct name, no changes will be made.
 */

module.exports = {
  async up(knex) {
    if (await knex.schema.hasColumn("protected_areas", "status")) {
      await knex.schema.table("protected_areas", (table) => {
        table.renameColumn("status", "statusCode");
      });
    }

    if (await knex.schema.hasColumn("sites", "status")) {
      await knex.schema.table("sites", (table) => {
        table.renameColumn("status", "statusCode");
      });
    }
  },
};
