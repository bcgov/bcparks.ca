'use strict'

async function up(knex) {

  // turn h3 into h4 and turn h4 into h5
  if (await knex.schema.hasTable('park_camping_types')) {
    await knex.raw(`update park_camping_types set description = replace(description, '<h3', '<h4') where description like '%<h3%' and description not like '%<h4%'`);
    await knex.raw(`update park_camping_types set description = replace(description, '</h3', '</h4') where description like '%</h3%' and description not like '%</h4%'`);
    await knex.raw(`update park_camping_types set description = replace(description, '</h4', '</h5') where (description like '%</h3%' and description like '%</h4%') and description not like '%</h5%'`);
    await knex.raw(`update park_camping_types set description = replace(description, '<h4', '<h5') where (description like '%<h3%' and description like '%<h4%') and description not like '%<h5%'`);
    await knex.raw(`update park_camping_types set description = replace(description, '<h3', '<h4') where description like '%<h3%' and description not like '%<h4%'`);
    await knex.raw(`update park_camping_types set description = replace(description, '</h3', '</h4') where description like '%</h3%' and description not like '%</h4%'`);

    await knex.raw(`update park_facilities set description = replace(description, '<h3', '<h4') where description like '%<h3%' and description not like '%<h4%'`);
    await knex.raw(`update park_facilities set description = replace(description, '</h3', '</h4') where description like '%</h3%' and description not like '%</h4%'`);
    await knex.raw(`update park_facilities set description = replace(description, '</h4', '</h5') where (description like '%</h3%' and description like '%</h4%') and description not like '%</h5%'`);
    await knex.raw(`update park_facilities set description = replace(description, '<h4', '<h5') where (description like '%<h3%' and description like '%<h4%') and description not like '%<h5%'`);
    await knex.raw(`update park_facilities set description = replace(description, '<h3', '<h4') where description like '%<h3%' and description not like '%<h4%'`);
    await knex.raw(`update park_facilities set description = replace(description, '</h3', '</h4') where description like '%</h3%' and description not like '%</h4%'`);

    await knex.raw(`update park_activities set description = replace(description, '<h3', '<h4') where description like '%<h3%' and description not like '%<h4%'`);
    await knex.raw(`update park_activities set description = replace(description, '</h3', '</h4') where description like '%</h3%' and description not like '%</h4%'`);
    await knex.raw(`update park_activities set description = replace(description, '</h4', '</h5') where (description like '%</h3%' and description like '%</h4%') and description not like '%</h5%'`);
    await knex.raw(`update park_activities set description = replace(description, '<h4', '<h5') where (description like '%<h3%' and description like '%<h4%') and description not like '%<h5%'`);
    await knex.raw(`update park_activities set description = replace(description, '<h3', '<h4') where description like '%<h3%' and description not like '%<h4%'`);
    await knex.raw(`update park_activities set description = replace(description, '</h3', '</h4') where description like '%</h3%' and description not like '%</h4%'`);

    // remove empty lines
    await knex.raw(`update park_camping_types set description = replace(description,'<p>&nbsp;</p>','') where description like '%<p>&nbsp;</p>%'`);
    await knex.raw(`update park_facilities set description = replace(description,'<p>&nbsp;</p>','') where description like '%<p>&nbsp;</p>%'`);
    await knex.raw(`update park_activities set description = replace(description,'<p>&nbsp;</p>','') where description like '%<p>&nbsp;</p>%'`);
  }
}

module.exports = { up };
