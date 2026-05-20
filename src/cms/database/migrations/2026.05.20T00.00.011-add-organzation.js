"use strict";

module.exports = {
  async up(knex) {
    // add the organization column to access_statuses, event_types, and standard_messages tables, and set the default value to 'BCP' for existing records

    if (await knex.schema.hasTable("access_statuses")) {
      if (!(await knex.schema.hasColumn("access_statuses", "organization"))) {
        await knex.schema.table("access_statuses", (table) => {
          table.string("organization");
        });
      }
      await knex("access_statuses")
        .whereNull("organization")
        .update({ organization: "BCP" });
    }

    if (await knex.schema.hasTable("event_types")) {
      if (!(await knex.schema.hasColumn("event_types", "organization"))) {
        await knex.schema.table("event_types", (table) => {
          table.string("organization");
        });
      }
      await knex("event_types")
        .whereNull("organization")
        .update({ organization: "BCP" });
    }

    if (await knex.schema.hasTable("standard_messages")) {
      if (!(await knex.schema.hasColumn("standard_messages", "organization"))) {
        await knex.schema.table("standard_messages", (table) => {
          table.string("organization");
        });
      }
      await knex("standard_messages")
        .whereNull("organization")
        .update({ organization: "BCP" });
    }
  },
};
