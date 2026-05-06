"use strict";

module.exports = {
  async up(knex) {
    if (
      (await knex.schema.hasTable("park_features")) &&
      (await knex.schema.hasColumn("park_features", "has_dates"))
    ) {
      await knex("park_features")
        .whereNull("has_dates")
        .update({ has_dates: false });
    }

    if (
      (await knex.schema.hasTable("park_operations")) &&
      (await knex.schema.hasColumn("park_operations", "has_dates"))
    ) {
      await knex("park_operations")
        .whereNull("has_dates")
        .update({ has_dates: false });
    }
  },
};
