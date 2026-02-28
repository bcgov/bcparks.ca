"use strict";

/*
  This migration is primarily intended for environments that have already been
  upgraded to Strapi v5. It will ensure that the new `is_active` fields are populated
  so they can be used for filtering.
*/

module.exports = {
  async up(knex) {
    if (await knex.schema.hasTable("access_statuses")) {
      if (!(await knex.schema.hasColumn("access_statuses", "is_active"))) {
        await knex.schema.table("access_statuses", (table) => {
          table.boolean("is_active").nullable().defaultTo(true);
        });
      }

      await knex("access_statuses").update({ is_active: true });
    }

    if (await knex.schema.hasTable("standard_messages")) {
      if (!(await knex.schema.hasColumn("standard_messages", "is_active"))) {
        await knex.schema.table("standard_messages", (table) => {
          table.boolean("is_active").nullable().defaultTo(true);
        });
      }

      await knex("standard_messages").update({ is_active: true });
    }
  },
};
