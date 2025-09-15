"use strict";

const rows = [
  "Anchorage area",
  "Backcountry area",
  "Backcountry campground",
  "Backcountry marine-access campground",
  "Bike park",
  "Cabin",
  "Conservation area",
  "Day-use area",
  "Developed beach",
  "Disc golf course",
  "Frontcountry campground",
  "Frontcountry marine-accessible campground",
  "Group campground",
  "Hut",
  "Lawn",
  "Mooring area",
  "Parking area",
  "Picnic area",
  "Service yard",
  "Shelter",
  "Snowmobiling area",
  "Sports court",
  "Swimming area",
  "Trail",
  "Walk-in camping",
  "Wilderness area",
  "Wilderness camping area",
];

module.exports = {
  async up(knex) {
    if (await knex.schema.hasTable("park_area_types")) {
      await strapi.db.transaction(async () => {
        for (const row of rows) {
          try {
            await strapi.entityService.create(
              "api::park-area-type.park-area-type",
              {
                data: {
                  name: row,
                  publishedAt: new Date().toISOString(),
                },
              }
            );
          } catch (error) {
            console.error(`Failed to insert: ${row}`, error);
          }
        }
      });
    }
  },
};
