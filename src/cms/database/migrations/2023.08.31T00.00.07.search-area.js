'use strict'

async function up(knex) {

    if (await knex.schema.hasTable('search_areas')) {
        await knex.raw(`delete from search_areas;`);
        await knex.raw(`insert into search_areas(id, search_area_name, "rank", created_at, published_at) values (3, 'Lower Mainland', 1, current_timestamp, current_timestamp);`);
        await knex.raw(`insert into search_areas(id, search_area_name, "rank", created_at, published_at) values (10, 'South Island', 2, current_timestamp, current_timestamp);`);
        await knex.raw(`insert into search_areas(id, search_area_name, "rank", created_at, published_at) values (7, 'Okanagan', 3, current_timestamp, current_timestamp);`);
        await knex.raw(`insert into search_areas(id, search_area_name, "rank", created_at, published_at) values (5, 'Sea to Sky', 4, current_timestamp, current_timestamp);`);
        await knex.raw(`insert into search_areas(id, search_area_name, "rank", created_at, published_at) values (2, 'Kootenay', 5, current_timestamp, current_timestamp);`);
        await knex.raw(`insert into search_areas(id, search_area_name, "rank", created_at, published_at) values (1, 'Thompson', 6, current_timestamp, current_timestamp);`);
        await knex.raw(`insert into search_areas(id, search_area_name, "rank", created_at, published_at) values (12, 'Cariboo', 7, current_timestamp, current_timestamp);`);
        await knex.raw(`insert into search_areas(id, search_area_name, "rank", created_at, published_at) values (13, 'Haida Gwaii', 8, current_timestamp, current_timestamp);`);
        await knex.raw(`insert into search_areas(id, search_area_name, "rank", created_at, published_at) values (6, 'North Island', 9, current_timestamp, current_timestamp);`);
        await knex.raw(`insert into search_areas(id, search_area_name, "rank", created_at, published_at) values (4, 'Omineca', 10, current_timestamp, current_timestamp);`);
        await knex.raw(`insert into search_areas(id, search_area_name, "rank", created_at, published_at) values (11, 'Peace', 11, current_timestamp, current_timestamp);`);
        await knex.raw(`insert into search_areas(id, search_area_name, "rank", created_at, published_at) values (9, 'Skeena East', 12, current_timestamp, current_timestamp);`);
        await knex.raw(`insert into search_areas(id, search_area_name, "rank", created_at, published_at) values (8, 'Skeena West', 13, current_timestamp, current_timestamp);`);
        await knex.raw(`insert into search_areas(id, search_area_name, "rank", created_at, published_at) values (14, 'South Central Coast', 14, current_timestamp, current_timestamp);`);
        await knex.raw(`select setval('search_areas_id_seq', max("id")) from search_areas;`);
        await knex.raw(`insert into management_areas_search_area_links (management_area_id, search_area_id) select management_area_id, section_id as search_area_id from management_areas_section_links;`);
        await knex.raw(`update management_areas_search_area_links set search_area_id = 13 where management_area_id = 45;`);
        await knex.raw(`update management_areas_search_area_links set search_area_id = 14 where management_area_id = 7;`);
    }
}

module.exports = { up };