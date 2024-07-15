'use strict'

async function up(knex) {
  if (await knex.schema.hasTable('park_camping_types')) {
    // get a list of the 'isCamping' facility types
    const campingTypes = await strapi.db.query("api::facility-type.facility-type").findMany(
      {
        filters: {
          isCamping: { $eq: true }
        }
      }
    );

    // copy the camping facility types to camping types
    for (const ct of campingTypes) {
      await knex('camping_types').insert({
        camping_type_number: ct.facilityNumber,
        camping_type_name: ct.facilityName,
        camping_type_code: ct.facilityCode,
        icon: ct.icon,
        icon_na: ct.iconNA,
        rank: ct.rank,
        note: ct.note,
        is_active: ct.isActive,
        default_description: ct.defaultDescription,
        append_standard_callout_text: ct.appendStandardCalloutText,
        published_at: new Date().toISOString()
      });
    }
  }
}

module.exports = { up };
