"use strict";

/*
This migration updates the scope field on existing records in the access_statuses
table to be "BCP" or "Both" based on data provided in a spreadsheet in Jira.
*/

module.exports = {
  async up(knex) {
    // check if the access_statuses table exists and if it contains a "scope" column
    if (await knex.schema.hasTable("access_statuses")) {
      // if the scope column doesn't exist then we'll create it now
      if (!(await knex.schema.hasColumn("access_statuses", "scope"))) {
        await knex.schema.table("access_statuses", (table) => {
          table.string("scope");
        });
      }

      await knex("access_statuses").update({ scope: "Both" });

      await knex.raw(`
        UPDATE access_statuses
        SET scope = 'BCP'
        WHERE access_status IN (
          'Restricted: permit required',
          'Open to public',
          'Seasonal restrictions'
        );
      `);
    }
  },
};
