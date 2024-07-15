'use strict'

async function up(knex) {
  if (await knex.schema.hasTable('park_camping_types')) {

    console.log(" delete from park-facility");
    await knex.raw(`DELETE FROM park_facilities WHERE id IN (SELECT park_facility_id FROM park_facilities_facility_type_links WHERE facility_type_id IN (SELECT id FROM facility_types WHERE is_camping = TRUE))`);

    console.log(" delete from facility-type");
    await knex.raw(`DELETE FROM facility_types WHERE is_camping = TRUE`);

    console.log(" link camping types and facility types");

    // link some subarea types to camping types
    await knex.raw(`INSERT INTO park_operation_sub_area_types_camping_type_links (park_operation_sub_area_type_id, camping_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Backcountry' LIMIT 1),(SELECT id FROM camping_types WHERE camping_type_code = 'backcountry-camping' LIMIT 1));`);
    await knex.raw(`INSERT INTO park_operation_sub_area_types_camping_type_links (park_operation_sub_area_type_id, camping_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Cabin' LIMIT 1),(SELECT id FROM camping_types WHERE camping_type_code = 'cabins-huts' LIMIT 1));`);
    await knex.raw(`INSERT INTO park_operation_sub_area_types_camping_type_links (park_operation_sub_area_type_id, camping_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Frontcountry campground' LIMIT 1),(SELECT id FROM camping_types WHERE camping_type_code = 'frontcountry-camping' LIMIT 1));`);
    await knex.raw(`INSERT INTO park_operation_sub_area_types_camping_type_links (park_operation_sub_area_type_id, camping_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Group campground' LIMIT 1),(SELECT id FROM camping_types WHERE camping_type_code = 'group-camping' LIMIT 1));`);
    await knex.raw(`INSERT INTO park_operation_sub_area_types_camping_type_links (park_operation_sub_area_type_id, camping_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Hut' LIMIT 1),(SELECT id FROM camping_types WHERE camping_type_code = 'cabins-huts' LIMIT 1));`);
    await knex.raw(`INSERT INTO park_operation_sub_area_types_camping_type_links (park_operation_sub_area_type_id, camping_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Marine-accessible camping' LIMIT 1),(SELECT id FROM camping_types WHERE camping_type_code = 'marine-accessible-camping' LIMIT 1));`);
    await knex.raw(`INSERT INTO park_operation_sub_area_types_camping_type_links (park_operation_sub_area_type_id, camping_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Walk-in camping' LIMIT 1),(SELECT id FROM camping_types WHERE camping_type_code = 'walk-in-camping' LIMIT 1));`);
    await knex.raw(`INSERT INTO park_operation_sub_area_types_camping_type_links (park_operation_sub_area_type_id, camping_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Wilderness camping' LIMIT 1),(SELECT id FROM camping_types WHERE camping_type_code = 'wilderness-camping' LIMIT 1));`);

    // link other subarea types to facility types
    await knex.raw(`INSERT INTO park_operation_sub_area_types_facility_type_links (park_operation_sub_area_type_id, facility_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Boat launch' LIMIT 1),(SELECT id FROM facility_types WHERE facility_code = 'boat-launch' LIMIT 1));`);
    await knex.raw(`INSERT INTO park_operation_sub_area_types_facility_type_links (park_operation_sub_area_type_id, facility_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Day-use' LIMIT 1),(SELECT id FROM facility_types WHERE facility_code = 'day-use-area' LIMIT 1));`); // inactive facility-type
    await knex.raw(`INSERT INTO park_operation_sub_area_types_facility_type_links (park_operation_sub_area_type_id, facility_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Day-use area' LIMIT 1),(SELECT id FROM facility_types WHERE facility_code = 'day-use-area' LIMIT 1));`); // inactive facility-type
    await knex.raw(`INSERT INTO park_operation_sub_area_types_facility_type_links (park_operation_sub_area_type_id, facility_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Dock' LIMIT 1),(SELECT id FROM facility_types WHERE facility_code = 'dock' LIMIT 1));`); // inactive facility-type
    await knex.raw(`INSERT INTO park_operation_sub_area_types_facility_type_links (park_operation_sub_area_type_id, facility_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Mooring buoy' LIMIT 1),(SELECT id FROM facility_types WHERE facility_code = 'mooring-buoy' LIMIT 1));`); // inactive facility-type
    await knex.raw(`INSERT INTO park_operation_sub_area_types_facility_type_links (park_operation_sub_area_type_id, facility_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Picnic area' LIMIT 1),(SELECT id FROM facility_types WHERE facility_code = 'picnic-areas' LIMIT 1));`);
    await knex.raw(`INSERT INTO park_operation_sub_area_types_facility_type_links (park_operation_sub_area_type_id, facility_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Picnic shelter' LIMIT 1),(SELECT id FROM facility_types WHERE facility_code = 'picnic-shelters' LIMIT 1));`); // inactive facility-type
    await knex.raw(`INSERT INTO park_operation_sub_area_types_facility_type_links (park_operation_sub_area_type_id, facility_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Resort' LIMIT 1),(SELECT id FROM facility_types WHERE facility_code = 'resort' LIMIT 1));`); // inactive facility-type
    await knex.raw(`INSERT INTO park_operation_sub_area_types_facility_type_links (park_operation_sub_area_type_id, facility_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Shelter' LIMIT 1),(SELECT id FROM facility_types WHERE facility_code = 'shelters' LIMIT 1));`); // inactive facility-type
    await knex.raw(`INSERT INTO park_operation_sub_area_types_facility_type_links (park_operation_sub_area_type_id, facility_type_id) VALUES ((SELECT id FROM park_operation_sub_area_types WHERE sub_area_type = 'Trail' LIMIT 1),(SELECT id FROM facility_types WHERE facility_code = 'trail' LIMIT 1));`); // inactive facility-type
  }
}

module.exports = { up };
