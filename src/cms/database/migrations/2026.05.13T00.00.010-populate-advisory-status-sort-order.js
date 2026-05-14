"use strict";

module.exports = {
  async up(knex) {
    if (!(await knex.schema.hasTable("advisory_statuses"))) {
      return;
    }

    if (!(await knex.schema.hasColumn("advisory_statuses", "sortOrder"))) {
      await knex.schema.table("advisory_statuses", (table) => {
        table.integer("sortOrder");
      });
    }

    await knex.raw(`
      UPDATE advisory_statuses
      SET sortOrder = CASE advisory_status
        WHEN 'Draft' THEN 0
        WHEN 'HQ review' THEN 1
        WHEN 'Scheduled' THEN 2
        WHEN 'Published' THEN 3
        WHEN 'Unpublished' THEN 4
        ELSE sortOrder
      END
      WHERE advisory_status IN ('Draft', 'HQ review', 'Scheduled', 'Published', 'Unpublished');
    `);
  },
};
