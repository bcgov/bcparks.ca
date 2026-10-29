"use strict";

module.exports = {
  /**
   * Renames protected_areas.feature_id to bcgnis_feature_id before Strapi syncs the updated schema.
   * @param {import("knex").Knex} knex - The configured database connection.
   * @returns {Promise<void>} Resolves when the column has been renamed.
   */
  async up(knex) {
    if (
      (await knex.schema.hasTable("protected_areas")) &&
      (await knex.schema.hasColumn("protected_areas", "feature_id")) &&
      !(await knex.schema.hasColumn("protected_areas", "bcgnis_feature_id"))
    ) {
      await knex.schema.table("protected_areas", (table) => {
        table.renameColumn("feature_id", "bcgnis_feature_id");
      });
    }
  },
};
