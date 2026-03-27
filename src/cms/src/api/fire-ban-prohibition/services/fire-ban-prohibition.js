"use strict";

/**
 * fire-ban-prohibition service
 */

const { createCoreService } = require("@strapi/strapi").factories;
const { indexPark } = require("../../../helpers/taskQueue.js");

module.exports = createCoreService(
  "api::fire-ban-prohibition.fire-ban-prohibition",
  ({ strapi }) => ({
    /* Sets the protectedArea.hasCampfireBan to false for all protectedAreas where it is
     * currently set to true, and sets the campfireBanRescindedDate to now on all records
     * being updated. Protected Areas with hasCampfireBanOverride==true are skipped.
     */
    async rescindAllProtectedAreaFireBans() {
      const protectedAreas = await strapi
        .documents("api::protected-area.protected-area")
        .findMany({
          status: "published",
          filters: {
            hasCampfireBan: true,
            $or: [
              { hasCampfireBanOverride: false },
              { hasCampfireBanOverride: { $null: true } },
            ],
          },
          fields: ["documentId", "orcs"],
        });

      for (const protectedArea of protectedAreas) {
        try {
          // Update the draft and published rows directly so fire-ban fields stay in sync
          // without publishing any in-progress editor changes.
          await strapi.db
            .query("api::protected-area.protected-area")
            .updateMany({
              where: {
                documentId: protectedArea.documentId,
              },
              data: {
                campfireBanRescindedDate: new Date()
                  .toISOString()
                  .split("T")[0],
                campfireBanEffectiveDate: null,
                hasCampfireBan: false,
              },
            });
          // Reindex manually because this bypasses document middleware.
          await indexPark(protectedArea.orcs);
        } catch (error) {
          strapi.log.error(
            `Error updating protected area ${protectedArea.orcs}:`,
            error,
          );
        }
      }

      // Clear rest-cache manually because this bypasses document middleware.
      await clearRestCache();
    },
    /* Loops through all fire-ban-prohibition records and sets the protectedArea.hasCampfireBan
     * to true for all Protected Areas in firezones associated with a fire ban. Protected Areas
     * with hasCampfireBanOverride==true are skipped.
     *
     */
    async generateAllProtectedAreaFireBans() {
      // sort the bans in descending order so the oldest one will be last and the earliest
      // date  will be applied to the protectedArea when there are multiple bans
      const campfireBans = await strapi
        .documents("api::fire-ban-prohibition.fire-ban-prohibition")
        .findMany({
          sort: { effectiveDate: "DESC" },
          filters: {
            $or: [
              {
                prohibitionDescription: { $containsi: "campfire" },
              },
              {
                prohibitionDescription: { $containsi: "category 1" },
              },
            ],
          },
          status: "published",
          populate: "*",
        });

      let rowsUpdated = 0;
      let banCount = 0;

      for (const ban of campfireBans) {
        // skip bans where the effectiveDate is in the future
        if (ban.effectiveDate > new Date().toISOString()) {
          continue;
        }

        // skip bans where the rescindedDate is in the past
        if (ban.rescindedDate < new Date().toISOString()) {
          continue;
        }

        if (ban.naturalResourceDistrict) {
          // get a list of protectedAreaIds to have firebans added.
          const protectedAreaIds =
            await getProtectedAreasByNaturalResourceDistrictToAddBan([
              ban.naturalResourceDistrict.documentId,
            ]);

          // add the campfire ban to all protectedAreas matching the natural resource district
          const count = await addProtectedAreaFireBans(
            protectedAreaIds,
            ban.effectiveDate,
          );
          rowsUpdated += count;
        }

        let fireZones = [];

        if (ban.fireCentre) {
          // turn fireCentre into an array of firezones
          const zones = await strapi
            .documents("api::fire-zone.fire-zone")
            .findMany({
              filters: {
                fireCentre: { documentId: ban.fireCentre.documentId },
              },
              fields: ["documentId"],
            });
          fireZones = zones.map((z) => z.documentId);
        }

        if (ban.fireZone && !fireZones.includes(ban.fireZone.documentId)) {
          fireZones = [...[ban.fireZone.documentId], ...fireZones];
        }

        if (fireZones.length) {
          // get a list of protectedAreaIds to have firebans added.
          const protectedAreaIds = await getProtectedAreasByFireZoneToAddBan(
            fireZones
          );

          // add the campfire ban to all protectedAreas matching the firezones
          const count = await addProtectedAreaFireBans(
            protectedAreaIds,
            ban.effectiveDate,
          );
          rowsUpdated += count;
        }

        banCount++;
      }
      return {
        campfireBanCount: banCount,
        parkCount: rowsUpdated,
      };
    },
    /* Gets an array of protected area ORCS that have fire bans
     */
    async getAllProtectedAreaFireBans() {
      const bans = await strapi
        .documents("api::protected-area.protected-area")
        .findMany({
          status: "published",
          filters: {
            hasCampfireBan: true,
          },
          fields: ["orcs"],
        });
      return bans.map((b) => {
        return b.orcs;
      });
    },
  }),
);

/* get a list of protectedAreaIds in a list of natural resource districts to have firebans added
 */
const getProtectedAreasByNaturalResourceDistrictToAddBan = async (
  naturalResourceDistricts,
) => {
  const protectedAreas = await strapi
    .documents("api::protected-area.protected-area")
    .findMany({
      status: "published",
      filters: {
        naturalResourceDistricts: {
          documentId: { $in: naturalResourceDistricts },
        },
        $or: [
          { hasCampfireBanOverride: false },
          { hasCampfireBanOverride: { $null: true } },
        ],
      },
      fields: ["documentId"],
    });
  return protectedAreas.map((p) => p.documentId);
};

/* get a list of protectedAreaIds in a list of firzones to have firebans added
 */
const getProtectedAreasByFireZoneToAddBan = async (fireZones) => {
  const protectedAreas = await strapi
    .documents("api::protected-area.protected-area")
    .findMany({
      status: "published",
      filters: {
        fireZones: {
          documentId: { $in: fireZones },
        },
        $or: [
          { hasCampfireBanOverride: false },
          { hasCampfireBanOverride: { $null: true } },
        ],
      },
      fields: ["documentId"],
    });
  return protectedAreas.map((p) => p.documentId);
};

/* Adds fire bans to a list of protected areas
 */
const addProtectedAreaFireBans = async (protectedAreaIds, effectiveDate) => {
  let count = 0;
  const protectedAreas = await strapi
    .documents("api::protected-area.protected-area")
    .findMany({
      status: "published",
      filters: {
        documentId: { $in: protectedAreaIds },
      },
      fields: ["documentId", "orcs"],
    });

  for (const protectedArea of protectedAreas) {
    try {
      // Update the draft and published rows directly so fire-ban fields stay in sync
      // without publishing any in-progress editor changes.
      await strapi.db.query("api::protected-area.protected-area").updateMany({
        where: {
          documentId: protectedArea.documentId,
        },
        data: {
          campfireBanEffectiveDate: effectiveDate?.split("T")[0],
          campfireBanRescindedDate: null,
          hasCampfireBan: true,
        },
      });
      // Reindex manually because this bypasses document middleware.
      await indexPark(protectedArea.orcs);
      count++;
    } catch (error) {
      strapi.log.error(
        `Error updating protected area ${protectedArea.orcs}:`,
        error,
      );
    }
  }

  // Clear rest-cache manually because this bypasses document middleware.
  await clearRestCache();

  return count;
};

async function clearRestCache() {
  const cachePlugin = strapi.plugins["rest-cache"];
  if (cachePlugin) {
    await cachePlugin.services.cacheStore.clearByUid(
      "api::protected-area.protected-area"
    );
  }
}
