"use strict";

module.exports = {
  async up(knex) {
    if (await knex.schema.hasTable("park_area_types")) {
      await knex.raw(
        `UPDATE park_area_types SET rank = 10000 WHERE area_type_id = 11;`
      ); // Frontcountry campground
      await knex.raw(
        `UPDATE park_area_types SET rank = 20000 WHERE area_type_id = 6;`
      ); // Cabin
      await knex.raw(
        `UPDATE park_area_types SET rank = 30000 WHERE area_type_id = 25;`
      ); // Walk-in camping
      await knex.raw(
        `UPDATE park_area_types SET rank = 40000 WHERE area_type_id = 13;`
      ); // Group campground
      await knex.raw(
        `UPDATE park_area_types SET rank = 50000 WHERE area_type_id = 28;`
      ); // Resort
      await knex.raw(
        `UPDATE park_area_types SET rank = 60000 WHERE area_type_id = 2;`
      ); // Backcountry area
      await knex.raw(
        `UPDATE park_area_types SET rank = 70000 WHERE area_type_id = 3;`
      ); // Backcountry campground
      await knex.raw(
        `UPDATE park_area_types SET rank = 80000 WHERE area_type_id = 12;`
      ); // Frontcountry marine-accessible campground
      await knex.raw(
        `UPDATE park_area_types SET rank = 90000 WHERE area_type_id = 4;`
      ); // Backcountry marine-access campground
      await knex.raw(
        `UPDATE park_area_types SET rank = 100000 WHERE area_type_id = 14;`
      ); // Hut
      await knex.raw(
        `UPDATE park_area_types SET rank = 110000 WHERE area_type_id = 20;`
      ); // Shelter
      await knex.raw(
        `UPDATE park_area_types SET rank = 120000 WHERE area_type_id = 29;`
      ); // Yurt
      await knex.raw(
        `UPDATE park_area_types SET rank = 130000 WHERE area_type_id = 27;`
      ); // Wilderness camping area
      await knex.raw(
        `UPDATE park_area_types SET rank = 140000 WHERE area_type_id = 8;`
      ); // Day-use area
      await knex.raw(
        `UPDATE park_area_types SET rank = 150000 WHERE area_type_id = 18;`
      ); // Picnic area
      await knex.raw(
        `UPDATE park_area_types SET rank = 160000 WHERE area_type_id = 9;`
      ); // Developed beach
      await knex.raw(
        `UPDATE park_area_types SET rank = 170000 WHERE area_type_id = 5;`
      ); // Bike park
      await knex.raw(
        `UPDATE park_area_types SET rank = 180000 WHERE area_type_id = 15;`
      ); // Lawn
      await knex.raw(
        `UPDATE park_area_types SET rank = 190000 WHERE area_type_id = 17;`
      ); // Parking area
      await knex.raw(
        `UPDATE park_area_types SET rank = 200000 WHERE area_type_id = 23;`
      ); // Swimming area
      await knex.raw(
        `UPDATE park_area_types SET rank = 210000 WHERE area_type_id = 10;`
      ); // Disc golf course
      await knex.raw(
        `UPDATE park_area_types SET rank = 220000 WHERE area_type_id = 16;`
      ); // Mooring area
      await knex.raw(
        `UPDATE park_area_types SET rank = 230000 WHERE area_type_id = 22;`
      ); // Sports court
      await knex.raw(
        `UPDATE park_area_types SET rank = 240000 WHERE area_type_id = 1;`
      ); // Anchorage area
      await knex.raw(
        `UPDATE park_area_types SET rank = 250000 WHERE area_type_id = 24;`
      ); // Trail
      await knex.raw(
        `UPDATE park_area_types SET rank = 260000 WHERE area_type_id = 26;`
      ); // Wilderness area
      await knex.raw(
        `UPDATE park_area_types SET rank = 270000 WHERE area_type_id = 21;`
      ); // Snowmobiling area
      await knex.raw(
        `UPDATE park_area_types SET rank = 280000 WHERE area_type_id = 7;`
      ); // Conservation area
      await knex.raw(
        `UPDATE park_area_types SET rank = 290000 WHERE area_type_id = 19;`
      ); // Service yard
    }

    if (await knex.schema.hasTable("park_feature_types")) {
      await knex.raw(
        `UPDATE park_feature_types SET rank = 10010 WHERE feature_type_id = 6;`
      ); // Frontcountry camping
      await knex.raw(
        `UPDATE park_feature_types SET rank = 10040 WHERE feature_type_id = 19;`
      ); // Winter camping
      await knex.raw(
        `UPDATE park_feature_types SET rank = 20020 WHERE feature_type_id = 4;`
      ); // Cabin
      await knex.raw(
        `UPDATE park_feature_types SET rank = 30030 WHERE feature_type_id = 17;`
      ); // Walk-in camping
      await knex.raw(
        `UPDATE park_feature_types SET rank = 40050 WHERE feature_type_id = 7;`
      ); // Group camping
      await knex.raw(
        `UPDATE park_feature_types SET rank = 50060 WHERE feature_type_id = 14;`
      ); // Resort
      await knex.raw(
        `UPDATE park_feature_types SET rank = 70070 WHERE feature_type_id = 2;`
      ); // Backcountry camping
      await knex.raw(
        `UPDATE park_feature_types SET rank = 90080 WHERE feature_type_id = 10;`
      ); // Marine-accessible camping
      await knex.raw(
        `UPDATE park_feature_types SET rank = 100090 WHERE feature_type_id = 9;`
      ); // Hut
      await knex.raw(
        `UPDATE park_feature_types SET rank = 110110 WHERE feature_type_id = 15;`
      ); // Shelter
      await knex.raw(
        `UPDATE park_feature_types SET rank = 120100 WHERE feature_type_id = 21;`
      ); // Yurt
      await knex.raw(
        `UPDATE park_feature_types SET rank = 130120 WHERE feature_type_id = 18;`
      ); // Wilderness camping
      await knex.raw(
        `UPDATE park_feature_types SET rank = 140130 WHERE feature_type_id = 12;`
      ); // Picnic area
      await knex.raw(
        `UPDATE park_feature_types SET rank = 140140 WHERE feature_type_id = 13;`
      ); // Picnic shelter
      await knex.raw(
        `UPDATE park_feature_types SET rank = 140150 WHERE feature_type_id = 20;`
      ); // Day-use area
      await knex.raw(
        `UPDATE park_feature_types SET rank = 140160 WHERE feature_type_id = 8;`
      ); // Hotspring
      await knex.raw(
        `UPDATE park_feature_types SET rank = 140170 WHERE feature_type_id = 3;`
      ); // Boat launch
      await knex.raw(
        `UPDATE park_feature_types SET rank = 220180 WHERE feature_type_id = 5;`
      ); // Dock
      await knex.raw(
        `UPDATE park_feature_types SET rank = 220190 WHERE feature_type_id = 11;`
      ); // Mooring buoy
      await knex.raw(
        `UPDATE park_feature_types SET rank = 240200 WHERE feature_type_id = 1;`
      ); // Anchorage
      await knex.raw(
        `UPDATE park_feature_types SET rank = 250210 WHERE feature_type_id = 16;`
      ); // Trail
    }
  },
};
