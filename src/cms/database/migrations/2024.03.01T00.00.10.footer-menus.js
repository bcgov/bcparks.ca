'use strict'

const rows = [
  {
    "id": 1,
    "title": "Get a permit",
    "url": null,
    "order": 1,
    "created_at": "2024-02-28T20:00:30.277Z",
    "updated_at": "2024-02-28T20:00:34.193Z",
    "published_at": "2024-02-28T20:00:34.188Z",
    "is_external_url": null
  },
  {
    "id": 2,
    "title": "Get involved",
    "url": null,
    "order": 2,
    "created_at": "2024-02-28T20:00:46.501Z",
    "updated_at": "2024-02-28T20:00:52.027Z",
    "published_at": "2024-02-28T20:00:52.023Z",
    "is_external_url": null
  },
  {
    "id": 3,
    "title": "Stay connected",
    "url": null,
    "order": 3,
    "created_at": "2024-02-28T20:01:08.932Z",
    "updated_at": "2024-02-28T20:01:14.896Z",
    "published_at": "2024-02-28T20:01:14.890Z",
    "is_external_url": null
  },
  {
    "id": 4,
    "title": "Park-use permits",
    "url": "/park-use-permits/",
    "order": 1,
    "created_at": "2024-02-28T20:02:21.754Z",
    "updated_at": "2024-02-29T00:44:03.372Z",
    "published_at": "2024-02-28T20:02:23.565Z",
    "is_external_url": false
  },
  {
    "id": 5,
    "title": "Filming in parks",
    "url": "/park-use-permits/filming-in-parks/",
    "order": 2,
    "created_at": "2024-02-28T20:03:11.438Z",
    "updated_at": "2024-02-29T00:44:12.753Z",
    "published_at": "2024-02-28T20:05:00.216Z",
    "is_external_url": false
  },
  {
    "id": 6,
    "title": "Travel trade",
    "url": "/park-use-permits/travel-trade/",
    "order": 3,
    "created_at": "2024-02-28T20:05:49.900Z",
    "updated_at": "2024-02-29T00:44:18.653Z",
    "published_at": "2024-02-28T20:05:50.901Z",
    "is_external_url": false
  },
  {
    "id": 7,
    "title": "Donate",
    "url": "/get-involved/donate/",
    "order": 1,
    "created_at": "2024-02-28T20:06:36.277Z",
    "updated_at": "2024-02-29T00:44:25.134Z",
    "published_at": "2024-02-28T20:06:37.432Z",
    "is_external_url": false
  },
  {
    "id": 8,
    "title": "Buy a licence plate",
    "url": "/get-involved/buy-licence-plate/",
    "order": 2,
    "created_at": "2024-02-28T20:08:19.223Z",
    "updated_at": "2024-02-29T00:44:31.469Z",
    "published_at": "2024-02-28T20:08:20.055Z",
    "is_external_url": false
  },
  {
    "id": 9,
    "title": "Volunteer",
    "url": "/get-involved/volunteer/",
    "order": 3,
    "created_at": "2024-02-28T20:08:54.946Z",
    "updated_at": "2024-02-29T00:44:38.028Z",
    "published_at": "2024-02-28T20:08:56.012Z",
    "is_external_url": false
  },
  {
    "id": 10,
    "title": "Contact us",
    "url": "/contact/",
    "order": 1,
    "created_at": "2024-02-28T20:11:12.168Z",
    "updated_at": "2024-02-29T00:44:43.803Z",
    "published_at": "2024-02-28T20:11:18.011Z",
    "is_external_url": false
  },
  {
    "id": 11,
    "title": "BC Parks blog",
    "url": "https://engage.gov.bc.ca/bcparksblog/",
    "order": 2,
    "created_at": "2024-02-28T20:11:48.149Z",
    "updated_at": "2024-02-28T23:52:54.317Z",
    "published_at": "2024-02-28T20:11:49.430Z",
    "is_external_url": true
  }
]

async function up(knex) {

  let i, j, rowsToInsert, chunk = 200;

  // insert rows in 200 row batches
  if (await knex.schema.hasTable('footer_menus')) {
    await knex.transaction(async trx => {
      for (i = 0, j = rows.length; i < j; i += chunk) {
        rowsToInsert = rows.slice(i, i + chunk);
        await trx('footer_menus').insert(rowsToInsert);
      }
    });

    await knex('footer_menus_parent_links').insert({ footer_menu_id: 4, inv_footer_menu_id: 1 });
    await knex('footer_menus_parent_links').insert({ footer_menu_id: 5, inv_footer_menu_id: 1 });
    await knex('footer_menus_parent_links').insert({ footer_menu_id: 6, inv_footer_menu_id: 1 });
    await knex('footer_menus_parent_links').insert({ footer_menu_id: 7, inv_footer_menu_id: 2 });
    await knex('footer_menus_parent_links').insert({ footer_menu_id: 8, inv_footer_menu_id: 2 });
    await knex('footer_menus_parent_links').insert({ footer_menu_id: 9, inv_footer_menu_id: 2 });
    await knex('footer_menus_parent_links').insert({ footer_menu_id: 10, inv_footer_menu_id: 3 });
    await knex('footer_menus_parent_links').insert({ footer_menu_id: 11, inv_footer_menu_id: 3 });

  }
}

module.exports = { up };