'use strict'

async function up(knex) {

  if (await knex.schema.hasColumn('camping_types', 'plural_name')) {
    await knex.raw(`update camping_types set plural_name = 'Yurts' where camping_type_code = 'yurt'`);
    await knex.raw(`update camping_types set plural_name = 'Winter campgrounds' where camping_type_code = 'winter-camping'`);
    await knex.raw(`update camping_types set plural_name = 'Backcountry areas' where camping_type_code = 'backcountry-camping'`);
    await knex.raw(`update camping_types set plural_name = 'Boat-accessible campgrounds' where camping_type_code = 'boat-camping'`);
    await knex.raw(`update camping_types set plural_name = 'Cabins and huts' where camping_type_code = 'cabins-huts'`);
    await knex.raw(`update camping_types set plural_name = 'Frontcountry campgrounds' where camping_type_code = 'frontcountry-camping'`);
    await knex.raw(`update camping_types set plural_name = 'Group campgrounds' where camping_type_code = 'group-camping'`);
    await knex.raw(`update camping_types set plural_name = 'Huts' where camping_type_code = 'hut'`);
    await knex.raw(`update camping_types set plural_name = 'Marine-accessible campgrounds' where camping_type_code = 'marine-accessible-camping'`);
    await knex.raw(`update camping_types set plural_name = 'RV-accessible campgrounds' where camping_type_code = 'rv'`);
    await knex.raw(`update camping_types set plural_name = 'Walk-in campgrounds' where camping_type_code = 'walk-in-camping'`);
    await knex.raw(`update camping_types set plural_name = 'Wilderness areas' where camping_type_code = 'wilderness-camping'`);
  }
}

module.exports = { up };
