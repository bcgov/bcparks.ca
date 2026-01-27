"use strict";

/*
 Renames "status" column to "legal_status" in "protected_areas" and "sites" tables.
 Updates values: 'A'/NULL → 'Active', 'R' → 'Repealed', 'C' → 'Closed', 'T' → 'Transitioned'.
 "status" is a reserved word in Strapi 5, and the old value definitions were not well-known.
*/

module.exports = {
  async up(knex) {
    // Rename and update "protected_areas" table
    if (await knex.schema.hasColumn("protected_areas", "status")) {
      await knex.schema.table("protected_areas", (table) => {
        table.renameColumn("status", "legal_status");
      });
    }

    if (await knex.schema.hasTable("protected_areas")) {
      await knex.raw(
        "UPDATE protected_areas SET legal_status = 'Active' WHERE legal_status IS NULL or legal_status = '' or legal_status = 'A';"
      );

      await knex.raw(
        "UPDATE protected_areas SET legal_status = 'Repealed' WHERE legal_status = 'R';"
      );

      await knex.raw(
        "UPDATE protected_areas SET legal_status = 'Closed' WHERE legal_status = 'C';"
      );

      await knex.raw(
        "UPDATE protected_areas SET legal_status = 'Transitioned' WHERE legal_status = 'T';"
      );
    }

    // Rename and update "sites" table
    if (await knex.schema.hasColumn("sites", "status")) {
      await knex.schema.table("sites", (table) => {
        table.renameColumn("status", "legal_status");
      });
    }

    if (await knex.schema.hasTable("sites")) {
      await knex.raw(
        "UPDATE sites SET legal_status = 'Active' WHERE legal_status IS NULL or legal_status = '' or legal_status = 'A';"
      );

      await knex.raw(
        "UPDATE sites SET legal_status = 'Repealed' WHERE legal_status = 'R';"
      );

      await knex.raw(
        "UPDATE sites SET legal_status = 'Closed' WHERE legal_status = 'C';"
      );

      await knex.raw(
        "UPDATE sites SET legal_status = 'Transitioned' WHERE legal_status = 'T';"
      );
    }
  },
};
