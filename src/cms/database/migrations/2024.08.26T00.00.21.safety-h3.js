'use strict'

async function up(knex) {
  // turn h3 into h4 and turn h4 into h5
  await knex.raw(`update protected_areas set safety_info = replace(safety_info, '<h3', '<h4') where safety_info like '%<h3%' and safety_info not like '%<h4%'`);
  await knex.raw(`update protected_areas set safety_info = replace(safety_info, '</h3', '</h4') where safety_info like '%</h3%' and safety_info not like '%</h4%'`);
  await knex.raw(`update protected_areas set safety_info = replace(safety_info, '</h4', '</h5') where (safety_info like '%</h3%' and safety_info like '%</h4%') and safety_info not like '%</h5%'`);
  await knex.raw(`update protected_areas set safety_info = replace(safety_info, '<h4', '<h5') where (safety_info like '%<h3%' and safety_info like '%<h4%') and safety_info not like '%<h5%'`);
  await knex.raw(`update protected_areas set safety_info = replace(safety_info, '<h3', '<h4') where safety_info like '%<h3%' and safety_info not like '%<h4%'`);
  await knex.raw(`update protected_areas set safety_info = replace(safety_info, '</h3', '</h4') where safety_info like '%</h3%' and safety_info not like '%</h4%'`);

  await knex.raw(`update protected_areas set special_notes = replace(special_notes, '<h3', '<h4') where special_notes like '%<h3%' and special_notes not like '%<h4%'`);
  await knex.raw(`update protected_areas set special_notes = replace(special_notes, '</h3', '</h4') where special_notes like '%</h3%' and special_notes not like '%</h4%'`);
  await knex.raw(`update protected_areas set special_notes = replace(special_notes, '</h4', '</h5') where (special_notes like '%</h3%' and special_notes like '%</h4%') and special_notes not like '%</h5%'`);
  await knex.raw(`update protected_areas set special_notes = replace(special_notes, '<h4', '<h5') where (special_notes like '%<h3%' and special_notes like '%<h4%') and special_notes not like '%<h5%'`);
  await knex.raw(`update protected_areas set special_notes = replace(special_notes, '<h3', '<h4') where special_notes like '%<h3%' and special_notes not like '%<h4%'`);
  await knex.raw(`update protected_areas set special_notes = replace(special_notes, '</h3', '</h4') where special_notes like '%</h3%' and special_notes not like '%</h4%'`);
}

module.exports = { up };
