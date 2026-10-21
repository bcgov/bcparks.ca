"use strict";

const COLUMN_RENAMES = [
  ["park_date_types", "date_type_id", "date_type_number"],
  ["park_feature_types", "feature_type_id", "feature_type_number"],
  ["marine_ecosections", "marine_ecosection_id", "marine_ecosection_number"],
  ["park_area_types", "area_type_id", "area_type_number"],
  ["park_name_types", "name_type_id", "name_type_number"],
  [
    "terrestrial_ecosections",
    "terrestrial_ecosection_id",
    "terrestrial_ecosection_number",
  ],
];

module.exports = {
  /**
   * Renames old numeric-key columns before Strapi syncs the updated schemas.
   * @param {import("knex").Knex} knex - The configured database connection.
   * @returns {Promise<void>} Resolves when existing columns have been renamed.
   */
  async up(knex) {
    for (const [tableName, oldColumn, newColumn] of COLUMN_RENAMES) {
      if (
        (await knex.schema.hasTable(tableName)) &&
        (await knex.schema.hasColumn(tableName, oldColumn)) &&
        !(await knex.schema.hasColumn(tableName, newColumn))
      ) {
        await knex.schema.table(tableName, (table) => {
          table.renameColumn(oldColumn, newColumn);
        });
      }
    }
  },
};
