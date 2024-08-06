'use strict'

async function up(knex) {
  if (await knex.schema.hasTable('park_camping_types')) {

    // create a lookup object to map facilityCodes to camping-types
    const campingTypes = await strapi.db.query("api::camping-type.camping-type").findMany();
    let ctMap = {};
    for (const ct of campingTypes) {
      ctMap[ct.campingTypeCode] = ct.id;
    }

    // get a list of parkFacilities to be converted to parkCampingTypes
    const parkFacilities = await strapi.entityService.findMany("api::park-facility.park-facility",
      {
        filters: {
          facilityType: {
            isCamping: { $eq: true }
          }
        },
        populate: {
          protectedArea: { fields: ["id"] },
          site: { fields: ["id"] },
          facilityType: { fields: ["facilityCode"] }
        }
      }
    );

    const campingTypeLinks = [];
    const protectedAreaLinks = [];
    const siteLinks = [];

    // copy the parkFacilities to parkCampingTypes
    for (const pf of parkFacilities) {

      const data = {
        name: pf.name,
        description: pf.description,
        is_camping_open: pf.isFacilityOpen,
        is_active: pf.isActive,
        modified_by: pf.modifiedBy,
        modified_date: pf.modifiedDate,
        hide_standard_callout: pf.hideStandardCallout,
        published_at: pf.publishedAt
      };

      await knex('park_camping_types')
        .insert(data)
        .returning('id')
        .then(async (resp) => {

          const newId = resp[0].id;

          // link campingType
          campingTypeLinks.push({ park_camping_type_id: newId, camping_type_id: ctMap[pf.facilityType.facilityCode] });

          // link protectedArea
          if (pf.protectedArea) {
            protectedAreaLinks.push({ park_camping_type_id: newId, protected_area_id: pf.protectedArea.id });
          }

          // link site
          if (pf.site) {
            siteLinks.push({ park_camping_type_id: newId, site_id: pf.site.id });
          }
        })
    }

    await knex('park_camping_types_camping_type_links').insert(campingTypeLinks);
    await knex('park_camping_types_protected_area_links').insert(protectedAreaLinks);
    await knex('park_camping_types_site_links').insert(siteLinks);

  }
}

module.exports = { up };
