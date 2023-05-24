'use strict'

async function up(knex) {

    await knex.from('public_advisory_audits').update({ listing_rank: 0 }).whereNull('listing_rank');

    await knex.from('public_advisories').update({ listing_rank: 0 }).whereNull('listing_rank');;

}

module.exports = { up };