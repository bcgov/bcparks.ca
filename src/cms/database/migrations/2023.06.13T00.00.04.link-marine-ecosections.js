'use strict'

async function up(knex) {
    if (await knex.schema.hasTable('marine_ecosections')) {
        const protectedAreas = await strapi.db.query("api::protected-area.protected-area").findMany(
            {
                select: ["id", "orcs"],
                limit: 2000,
            }
        );
        let pa = {};
        for (const area of protectedAreas) {
            pa[area.orcs] = area.id;
        }

        const marineEcosections = await strapi.db.query("api::marine-ecosection.marine-ecosection").findMany(
            {
                select: ["id", "marineEcosectionId"],
                limit: 2000,
            }
        );
        let me = {};
        for (const section of marineEcosections) {
            me[section.marineEcosectionId] = section.id;
        }

        // clear the table
        await knex('marine_ecosections_protected_areas_links').del();

        // import new data
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['3128'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['3067'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['3094'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['3048'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['8'], protected_area_id: pa['3103'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['3132'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['14'], protected_area_id: pa['3105'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['14'], protected_area_id: pa['3011'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['6'], protected_area_id: pa['3010'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['7'], protected_area_id: pa['3010'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['13'], protected_area_id: pa['3111'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['18'], protected_area_id: pa['3097'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['14'], protected_area_id: pa['3012'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['14'], protected_area_id: pa['3119'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['14'], protected_area_id: pa['3013'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['13'], protected_area_id: pa['3002'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['9743'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['5'], protected_area_id: pa['3025'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['8'], protected_area_id: pa['3025'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['14'], protected_area_id: pa['3001'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['3066'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['14'], protected_area_id: pa['3024'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['6'], protected_area_id: pa['3009'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['3028'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['3018'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['18'], protected_area_id: pa['4361'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['12'], protected_area_id: pa['3120'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['3017'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['8'], protected_area_id: pa['3023'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['155'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['3004'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['3037'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['6'], protected_area_id: pa['3093'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['14'], protected_area_id: pa['3014'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['3016'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['14'], protected_area_id: pa['3109'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['19'], protected_area_id: pa['3109'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['19'], protected_area_id: pa['3045'] });
        await knex('marine_ecosections_protected_areas_links').insert({ marine_ecosection_id: me['16'], protected_area_id: pa['475'] });

    }
}

module.exports = { up };