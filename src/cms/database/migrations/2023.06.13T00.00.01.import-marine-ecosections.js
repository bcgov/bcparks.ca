'use strict'

async function up(knex) {
    if (await knex.schema.hasTable('marine_ecosections')) {
        const now = new Date().toISOString();

        // clear the table
        await knex('marine_ecosections').del();

        // import new data
        await knex('marine_ecosections').insert({ marine_ecosection_id: 19, marine_ecosection: 'Continental Slope', marine_ecosection_code: 'CS', published_at: now });
        await knex('marine_ecosections').insert({ marine_ecosection_id: 6, marine_ecosection: 'Dixon Entrance', marine_ecosection_code: 'DE', published_at: now });
        await knex('marine_ecosections').insert({ marine_ecosection_id: 7, marine_ecosection: 'Hecate Strait', marine_ecosection_code: 'HS', published_at: now });
        await knex('marine_ecosections').insert({ marine_ecosection_id: 13, marine_ecosection: 'Johnstone Strait', marine_ecosection_code: 'JS', published_at: now });
        await knex('marine_ecosections').insert({ marine_ecosection_id: 18, marine_ecosection: 'Juan de Fuca Strait', marine_ecosection_code: 'JDFS', published_at: now });
        await knex('marine_ecosections').insert({ marine_ecosection_id: 5, marine_ecosection: 'North Coast Fjords', marine_ecosection_code: 'NCF', published_at: now });
        await knex('marine_ecosections').insert({ marine_ecosection_id: 8, marine_ecosection: 'Queen Charlotte Sound', marine_ecosection_code: 'QCS', published_at: now });
        await knex('marine_ecosections').insert({ marine_ecosection_id: 12, marine_ecosection: 'Queen Charlotte Strait', marine_ecosection_code: 'QCS', published_at: now });
        await knex('marine_ecosections').insert({ marine_ecosection_id: 16, marine_ecosection: 'Strait of Georgia', marine_ecosection_code: 'SOG', published_at: now });
        await knex('marine_ecosections').insert({ marine_ecosection_id: 20, marine_ecosection: 'Subarctic Pacific', marine_ecosection_code: 'SAP', published_at: now });
        await knex('marine_ecosections').insert({ marine_ecosection_id: 21, marine_ecosection: 'Transitional Pacific', marine_ecosection_code: 'TP', published_at: now });
        await knex('marine_ecosections').insert({ marine_ecosection_id: 14, marine_ecosection: 'Vancouver Island Shelf', marine_ecosection_code: 'VIS', published_at: now });
    }
}

module.exports = { up };