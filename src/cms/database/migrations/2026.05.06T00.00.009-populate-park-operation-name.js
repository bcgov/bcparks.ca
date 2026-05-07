"use strict";

/*
  This migration adds and backfills park operation names based on related entities.
  Priority is protected area name, then site name.
*/

module.exports = {
  async up(knex) {
    if (await knex.schema.hasTable("park_operations")) {
      if (!(await knex.schema.hasColumn("park_operations", "name"))) {
        await knex.schema.table("park_operations", (table) => {
          table.string("name");
        });
      }

      await knex.raw(`
        WITH name_build AS (
          SELECT
            po.id,
            COALESCE(s.orcs_site_number::text, '') || ': ' ||
            COALESCE(s.site_name, '') AS new_name
          FROM public.park_operations AS po
          LEFT JOIN public.park_operations_site_lnk AS posl ON posl.park_operation_id = po.id
          LEFT JOIN public.sites AS s ON s.id = posl.site_id
          WHERE s.orcs_site_number IS NOT NULL
        )
        UPDATE public.park_operations AS po
        SET name = nb.new_name
        FROM name_build AS nb
        WHERE nb.id = po.id
          AND (po.name IS NULL OR po.name = '');
      `);

      await knex.raw(`
        WITH name_build AS (
          SELECT
            po.id,
            COALESCE(p.orcs::text, '') || ': ' ||
            COALESCE(p.protected_area_name, '') AS new_name
          FROM public.park_operations AS po
          LEFT JOIN public.park_operations_protected_area_lnk AS popol ON popol.park_operation_id = po.id
          LEFT JOIN public.protected_areas AS p ON p.id = popol.protected_area_id
          WHERE p.orcs IS NOT NULL
        )
        UPDATE public.park_operations AS po
        SET name = nb.new_name
        FROM name_build AS nb
        WHERE nb.id = po.id;
      `);
    }
  },
};
