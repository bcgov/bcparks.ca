"use strict";

/**
 * fire-ban-prohibition service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::fire-ban-prohibition.fire-ban-prohibition",
  ({ strapi }) => ({
    /* Sets the protectedArea.hasCampfireBan to false for all protectedAreas where it is 
     * currently set to true, and sets the campfireBanRescindedDate to now on all records 
     * being updated. Protected Areas with hasCampfireBanOverride==true are skipped.
     */
    async rescindAllProtectedAreaFireBans() {
      return await strapi.db.query("api::protected-area.protected-area")
        .updateMany({
          where: {
            hasCampfireBan: true,
            $or: [
              { hasCampfireBanOverride: false },
              { hasCampfireBanOverride: { $null: true } }
            ]
          },
          data: {
            campfireBanRescindedDate: (new Date()).toISOString().split('T')[0],
            campfireBanEffectiveDate: null,
            hasCampfireBan: false
          },
        });
    },
    /* Loops through all fire-ban-prohibition records and sets the protectedArea.hasCampfireBan
     * to true for all Protected Areas in firezones associated with a fire ban. Protected Areas 
     * with hasCampfireBanOverride==true are skipped.
     * 
     */
    async generateAllProtectedAreaFireBans() {
      // sort the bans in descending order so the oldest one will be last and the earliest
      // date  will be applied to the protectedArea when there are multiple bans
      const allBans = await strapi.entityService.findMany(
        "api::fire-ban-prohibition.fire-ban-prohibition", {
        sort: { effectiveDate: 'DESC' },
        filter: { prohibitionDescription: { $containsi: 'campfire' } },
        populate: '*',
      });

      let rowsUpdated = 0;

      for (const ban of allBans) {

        let fireZones = [];
        if (ban.fireZone) {
          fireZones = [ban.fireZone.id];
        } else if (ban.fireCentre) {
          // turn fireCentre into an array of firezones
          const zones = await strapi.db.query("api::fire-zone.fire-zone")
            .findMany({
              where: { fireCentre: ban.fireCentre.id },
            })
          fireZones = zones.map(z => z.id);
        }

        if (fireZones.length) {
          // get a list of protectedAreaIds to have firebans added. This needs to 
          // be 2 parts because updateMany can't use deep filtering in the "where" criteria, 
          // but findMany can.
          const protectedAreas = await strapi.db.query("api::protected-area.protected-area")
            .findMany({
              where: {
                fireZones: {
                  id: { $in: fireZones },
                },
                $or: [
                  { hasCampfireBanOverride: false },
                  { hasCampfireBanOverride: { $null: true } }
                ]
              }
            });
          const protectedAreaIds = protectedAreas.map(p => p.id);

          // add the campfire ban to all protectedAreas matching the firezones
          const { count } = await strapi.db.query("api::protected-area.protected-area")
            .updateMany({
              where: {
                id: { $in: protectedAreaIds }
              },
              data: {
                campfireBanEffectiveDate: ban.effectiveDate?.split('T')[0],
                hasCampfireBan: true
              },
            });
          rowsUpdated += count;
        }
      }
      return { count: rowsUpdated };
    }
  })
);
