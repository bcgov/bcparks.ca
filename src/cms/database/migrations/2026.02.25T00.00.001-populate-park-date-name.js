"use strict";

/*
  This migration generates name fields for park dates based on related park date
  types, operating years, and park entities. In the future these will be generated
  by the name-generator middleware, but this one-time migration is needed to populate
  all existing records with name values.
*/

module.exports = {
  async up(knex) {
    if (await knex.schema.hasTable("park_dates")) {
      await knex.raw(`
        WITH name_build AS (
          SELECT
            pd.id,
            COALESCE(p.orcs::text, '') || ': ' ||
            COALESCE(pd.operating_year::text, '') || ' - ' ||
            COALESCE(pdt.date_type, '') AS new_name
          FROM public.park_dates AS pd
          LEFT JOIN public.park_dates_park_date_type_lnk AS pdtl ON pdtl.park_date_id = pd.id
          LEFT JOIN public.park_date_types AS pdt ON pdt.id = pdtl.park_date_type_id
          LEFT JOIN public.park_dates_protected_area_lnk AS pdfl ON pdfl.park_date_id = pd.id
          LEFT JOIN public.protected_areas AS p ON p.id = pdfl.protected_area_id
          WHERE p.orcs IS NOT NULL
        )
        UPDATE public.park_dates AS pd
        SET name = nb.new_name
        FROM name_build AS nb
        WHERE nb.id = pd.id;
      `);
      await knex.raw(`
        WITH name_build AS (
          SELECT
            pd.id,
            COALESCE('F-' || pf.orcs_feature_number::text, '') || ': ' ||
            COALESCE(pd.operating_year::text, '') || ' - ' ||
            COALESCE(pdt.date_type, '') AS new_name
          FROM public.park_dates AS pd
          LEFT JOIN public.park_dates_park_date_type_lnk AS pdtl ON pdtl.park_date_id = pd.id
          LEFT JOIN public.park_date_types AS pdt ON pdt.id = pdtl.park_date_type_id
          LEFT JOIN public.park_dates_park_feature_lnk AS pdfl ON pdfl.park_date_id = pd.id
          LEFT JOIN public.park_features AS pf ON pf.id = pdfl.park_feature_id
          WHERE pf.orcs_feature_number IS NOT NULL
        )
        UPDATE public.park_dates AS pd
        SET name = nb.new_name
        FROM name_build AS nb
        WHERE nb.id = pd.id;
      `);
    }
  },
};
