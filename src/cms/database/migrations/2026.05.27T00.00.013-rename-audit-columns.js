"use strict";

/**
 * Column naming conventions enforced in this migration:
 *
 * 1. Non-Strapi user name fields must end with `Name` — e.g. `submittedBy` → `submittedByName`,
 *    `modifiedBy` → `modifiedByName`
 * 2. Non-Strapi date fields must end with `Date` — e.g. `reviewedAt` → `reviewedDate`,
 *    `unpublishedAt` → `unpublishedDate`. Fields ending with `At` are reserved for Strapi
 *    system timestamps (`createdAt`, `updatedAt`, `publishedAt`)
 */

module.exports = {
  async up(knex) {
    if (await knex.schema.hasColumn("public_advisory_audits", "submitted_by")) {
      await knex.schema.table("public_advisory_audits", (table) => {
        table.renameColumn("submitted_by", "submitted_by_name");
      });
    }

    if (await knex.schema.hasColumn("public_advisory_audits", "modified_by")) {
      await knex.schema.table("public_advisory_audits", (table) => {
        table.renameColumn("modified_by", "modified_by_name");
      });
    }

    if (await knex.schema.hasColumn("public_advisory_audits", "reviewed_at")) {
      await knex.schema.table("public_advisory_audits", (table) => {
        table.renameColumn("reviewed_at", "reviewed_date");
      });
    }

    if (
      await knex.schema.hasColumn("public_advisory_audits", "unpublished_at")
    ) {
      await knex.schema.table("public_advisory_audits", (table) => {
        table.renameColumn("unpublished_at", "unpublished_date");
      });
    }
  },
};
