'use strict'

async function up(knex) {
    if (await knex.schema.hasTable('public_advisory_audits')) {
        await knex.from('public_advisory_audits').update({ listing_rank: 0 }).whereNull('listing_rank');
    }

    if (await knex.schema.hasTable('public_advisories')) {
        await knex.from('public_advisories').update({ listing_rank: 0 }).whereNull('listing_rank');;
    }
}

module.exports = { up };