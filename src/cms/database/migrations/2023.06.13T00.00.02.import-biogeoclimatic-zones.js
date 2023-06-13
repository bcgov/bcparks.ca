'use strict'

async function up(knex) {
    if (await knex.schema.hasTable('biogeoclimatic_zones')) {
        const now = new Date().toISOString();

        // clear the table
        await knex('biogeoclimatic_zones').del();

        // import new data
        await knex('biogeoclimatic_zones').insert({ zone: 'Boreal Altai Fescue Alpine', zone_code: 'BAFA', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Bunchgrass', zone_code: 'BG', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Boreal White and Black Spruce', zone_code: 'BWBS', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Coastal Douglas-fir', zone_code: 'CDF', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Coastal Mountain-heather Alpine', zone_code: 'CMA', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Coastal Western Hemlock', zone_code: 'CWH', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Engelmann Spruce – Subalpine Fir', zone_code: 'ESSF', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Interior Cedar – Hemlock', zone_code: 'ICH', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Interior Douglas-fir', zone_code: 'IDF', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Interior Mountain-heather Alpine', zone_code: 'IMA', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Montane Spruce', zone_code: 'MS', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Mountain Hemlock', zone_code: 'MH', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Ponderosa Pine', zone_code: 'PP', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Sub-Boreal Pine – Spruce', zone_code: 'SBPS', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Spruce – Willow – Birch', zone_code: 'SWB', published_at: now });
        await knex('biogeoclimatic_zones').insert({ zone: 'Sub-Boreal Spruce', zone_code: 'SBS', published_at: now });
    }
}

module.exports = { up };