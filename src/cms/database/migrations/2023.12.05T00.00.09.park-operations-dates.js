'use strict'

async function up(knex) {

  if (await knex.schema.hasTable('park_operation_dates')) {
    await knex.raw(`
              select p.open_date, p.close_date, l.protected_area_id, p.is_date_range_annual 
              from park_operations_protected_area_links l 
              inner join park_operations p on p.id = l.park_operation_id
            `)
      .then(async (resp) => {
        for (const row of resp.rows) {
          const year = (row.open_date || "").substring(0, 4);
          if (year === '2023') {
            // directly copy the open_date and close_date to 2023 dates
            await knex('park_operation_dates')
              .insert({ operating_year: 2023, gate_open_date: row.open_date, gate_close_date: row.close_date, published_at: new Date().toISOString() })
              .returning('id')
              .then(async (resp2) => {
                const newId = resp2[0].id;
                await knex('park_operation_dates_protected_area_links').insert({ park_operation_date_id: newId, protected_area_id: row.protected_area_id });
              })
            if (row.is_date_range_annual === true) {
              // insert published 2024 dates if is_date_range_annual is true
              await knex('park_operation_dates')
                .insert({ operating_year: 2024, gate_open_date: row.open_date.replace("2023", "2024"), gate_close_date: row.close_date.replace("2023", "2024"), published_at: new Date().toISOString() })
                .returning('id')
                .then(async (resp2) => {
                  const newId = resp2[0].id;
                  await knex('park_operation_dates_protected_area_links').insert({ park_operation_date_id: newId, protected_area_id: row.protected_area_id });
                })
            } else {
              // insert unpublished 2024 dates if is_date_range_annual is false
              await knex('park_operation_dates')
                .insert({ operating_year: 2024, gate_open_date: row.open_date.replace("2023", "2024"), gate_close_date: row.close_date.replace("2023", "2024") })
                .returning('id')
                .then(async (resp2) => {
                  const newId = resp2[0].id;
                  await knex('park_operation_dates_protected_area_links').insert({ park_operation_date_id: newId, protected_area_id: row.protected_area_id });
                })
            }
          }
        }
      })
  }
}

module.exports = { up };