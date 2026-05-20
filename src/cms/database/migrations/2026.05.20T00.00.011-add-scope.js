"use strict";

module.exports = {
  async up(knex) {
    // add the scope column to access_statuses, event_types, and standard_messages tables, and backfill existing records with 'BCP'

    if (await knex.schema.hasTable("access_statuses")) {
      if (!(await knex.schema.hasColumn("access_statuses", "scope"))) {
        await knex.schema.table("access_statuses", (table) => {
          table.string("scope");
        });
      }
      await knex("access_statuses").whereNull("scope").update({ scope: "BCP" });
    }

    if (await knex.schema.hasTable("event_types")) {
      if (!(await knex.schema.hasColumn("event_types", "scope"))) {
        await knex.schema.table("event_types", (table) => {
          table.string("scope");
        });
      }
      await knex("event_types").whereNull("scope").update({ scope: "BCP" });
    }

    if (await knex.schema.hasTable("standard_messages")) {
      if (!(await knex.schema.hasColumn("standard_messages", "scope"))) {
        await knex.schema.table("standard_messages", (table) => {
          table.string("scope");
        });
      }
      await knex("standard_messages")
        .whereNull("scope")
        .update({ scope: "BCP" });
    }
  },
};
