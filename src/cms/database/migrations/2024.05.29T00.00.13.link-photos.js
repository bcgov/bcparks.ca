'use strict'

async function up(knex) {
  if (await knex.schema.hasTable('park_photos_protected_area_links')) {
    const protectedAreas = await strapi.db.query("api::protected-area.protected-area").findMany(
      {
        select: ["id", "orcs"],
        limit: 2000,
      }
    );
    let pa = {};
    for (const area of protectedAreas) {
      pa[area.orcs] = area.id;
    }

    const sites = await strapi.db.query("api::site.site").findMany(
      {
        select: ["id", "orcsSiteNumber"],
        limit: 2000,
      }
    );
    let st = {};
    for (const site of sites) {
      st[site.orcsSiteNumber] = site.id;
    }

    // clear the tables
    await knex('park_photos_site_links').del();
    await knex('park_photos_protected_area_links').del();

    const photos = await strapi.db.query("api::park-photo.park-photo").findMany(
      {
        select: ["id", "orcs", "orcsSiteNumber"],
        limit: 10000,
      }
    );

    // link the protectedAreas
    for (const p of photos) {
      if (p.orcs && pa[p.orcs]) {
        await knex('park_photos_protected_area_links').insert({ park_photo_id: p.id, protected_area_id: pa[p.orcs] });
      }
    }

    // link the sites
    for (const p of photos) {
      if (p.orcsSiteNumber && st[p.orcsSiteNumber]) {
        await knex('park_photos_site_links').insert({ park_photo_id: p.id, site_id: st[p.orcsSiteNumber] });
      }
    }
  }
}

module.exports = { up };
