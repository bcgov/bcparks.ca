'use strict'

async function up(knex) {
  if (await knex.schema.hasColumn('park_operations', 'has_frontcountry_reservations')) {
    await knex.raw(`update park_operations set has_frontcountry_reservations = has_reservations;`);
  }
}

module.exports = { up };
