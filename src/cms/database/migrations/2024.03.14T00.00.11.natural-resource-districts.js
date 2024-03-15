'use strict'

const districts = [
  {
    "natural_resource_district_name": "Haida Gwaii Natural Resource District",
    "natural_resource_district_code": "RWC",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Fort Nelson Natural Resource District",
    "natural_resource_district_code": "RNO",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Coast Mountains Natural Resource District",
    "natural_resource_district_code": "RSK",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Chilliwack Natural Resource District",
    "natural_resource_district_code": "RSC",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Cascades Natural Resource District",
    "natural_resource_district_code": "RTO",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "100 Mile House Natural Resource District",
    "natural_resource_district_code": "RCB",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Sunshine Coast Natural Resource District",
    "natural_resource_district_code": "RSC",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "South Island Natural Resource District",
    "natural_resource_district_code": "RWC",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Cariboo-Chilcotin Natural Resource District",
    "natural_resource_district_code": "RCB",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "North Island - Central Coast Natural Resource District",
    "natural_resource_district_code": "RWC",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Campbell River Natural Resource District",
    "natural_resource_district_code": "RWC",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Thompson Rivers Natural Resource District",
    "natural_resource_district_code": "RTO",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Stuart Nechako Natural Resource District",
    "natural_resource_district_code": "ROM",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Skeena Stikine Natural Resource District",
    "natural_resource_district_code": "RSK",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Selkirk Natural Resource District",
    "natural_resource_district_code": "RKB",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Sea to Sky Natural Resource District",
    "natural_resource_district_code": "RSC",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Rocky Mountain Natural Resource District",
    "natural_resource_district_code": "RKB",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Quesnel Natural Resource District",
    "natural_resource_district_code": "RCB",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Prince George Natural Resource District",
    "natural_resource_district_code": "ROM",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Peace Natural Resource District",
    "natural_resource_district_code": "RNO",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Okanagan Shuswap Natural Resource District",
    "natural_resource_district_code": "RTO",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Nadina Natural Resource District",
    "natural_resource_district_code": "RSK",
    "published_at": "2024-03-14T20:00:34.188Z"
  },
  {
    "natural_resource_district_name": "Mackenzie Natural Resource District",
    "natural_resource_district_code": "ROM",
    "published_at": "2024-03-14T20:00:34.188Z"
  }
];

async function up(knex) {

  // insert districts
  if (await knex.schema.hasTable('natural_resource_districts')) {
    await knex.transaction(async trx => {
      await trx('natural_resource_districts').insert(districts);
    });
  }
}

module.exports = { up };