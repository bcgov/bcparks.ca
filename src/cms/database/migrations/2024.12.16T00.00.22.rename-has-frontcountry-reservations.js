'use strict'

async function up(knex) {
  if (await knex.schema.hasColumn('park_operations', 'has_reservations')) {
    await knex.raw(`update park_operations set has_reservations = has_frontcountry_reservations;`);
    await knex.raw(`update park_operations set has_reservations = true where reservation_url is not null;`);
  }
}

module.exports = { up };
