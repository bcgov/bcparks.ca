'use strict';

/**
 * public advisory scheduling service
 */

const { queueAdvisoryEmail } = require("../../../helpers/taskQueue.js");

module.exports = ({ strapi }) => ({

  expire: async (advisoryStatusMap) => {
    let expiredAdvisoryCount = 0;

    if (Object.keys(advisoryStatusMap).length > 0) {
      // fetch advisories to unpublish - public advisory table
      const advisoryToUnpublish = await strapi.entityService.findMany(
        "api::public-advisory.public-advisory", {
        filters: {
          expiryDate: {
            $lte: new Date().toISOString()
          },
          advisoryStatus: advisoryStatusMap["PUB"].id,
        },
        publicationState: "live",
        populate: "*",
      });

      // delete advisories - public advisory table
      advisoryToUnpublish.forEach(async (advisory) => {
        strapi.log.info(`unpublishing public-advisory [advisoryNumber:${advisory.advisoryNumber}]`);
        await strapi.entityService.update(
          "api::public-advisory.public-advisory", advisory.id, {
          data: {
            publishedAt: null,
          }
        })
          .then(async (advisory) => {
            expiredAdvisoryCount++;
            await queueAdvisoryEmail(
              "Expired advisory removed",
              "An expired advisory was removed",
              advisory.advisoryNumber,
              "public-advisory-audit::services::scheduling::expire()"
            );
          })
          .catch((error) => {
            strapi.log.error(
              `error updating public-advisory #${advisory.advisoryNumber}`,
              error
            );
          });
      })

      // unpublish advisories - audit table
      advisoryToUnpublish.forEach(async (advisory) => {
        const advisoryAudit = await strapi.entityService.findMany(
          "api::public-advisory-audit.public-advisory-audit", {
          filters: {
            advisoryNumber: advisory.advisoryNumber,
            isLatestRevision: true
          }
        });
        if (advisoryAudit.length) {
          strapi.log.info(`setting public-advisory-audit to inactive [advisoryNumber:${advisory.advisoryNumber}]`);
          await strapi.entityService.update(
            "api::public-advisory-audit.public-advisory-audit", advisoryAudit[0].id, {
            data: {
              publishedAt: new Date(),
              advisoryStatus: {
                id: advisoryStatusMap["INA"].id
              },
              removalDate: new Date(),
              modifiedBy: "system",
              modifiedDate: new Date(),
            }
          }
          )
            .catch((error) => {
              strapi.log.error(
                `error updating public-advisory-audit #${advisory.advisoryNumber}`,
                error
              );
            });
        }
      });
    }
    return expiredAdvisoryCount;
  },
  publish: async (advisoryStatusMap) => {
    if (Object.keys(advisoryStatusMap).length > 0) {
      // fetch advisories to publish - audit table
      const draftAdvisoryToPublishAudit = await strapi.entityService.findMany(
        "api::public-advisory-audit.public-advisory-audit", {
        filters: {
          isLatestRevision: true,
          advisoryDate: {
            $lte: new Date().toISOString()
          },
          advisoryStatus: advisoryStatusMap["APR"].id,
        },
        publicationState: "live",
        populate: "*",
      }
      );

      let publishedAdviosryCount = 0;

      // publish advisories - audit table
      draftAdvisoryToPublishAudit.forEach(async (advisory) => {
        strapi.log.info(`publishing approved public-advisory-audit [advisoryNumber:${advisory.advisoryNumber}]`);
        await strapi.entityService.update(
          "api::public-advisory-audit.public-advisory-audit", advisory.id, {
          data: {
            publishedAt: advisory.advisoryDate,
            advisoryStatus: {
              id: advisoryStatusMap["PUB"].id,
            },
            modifiedBy: "system",
            modifiedDate: new Date(),
            removalDate: null,
          }
        }
        )
          .then(async (advisory) => {
            publishedAdviosryCount++;
            await queueAdvisoryEmail(
              "Scheduled advisory posted",
              "A scheduled advisory was posted",
              advisory.advisoryNumber,
              "public-advisory-audit::services::scheduling::publish()");
          })
          .catch((error) => {
            strapi.log.error(
              `error updating public-advisory-audit #${advisory.advisoryNumber}`,
              error
            );
          });
      });

      return publishedAdviosryCount;
    }
  },
  getAdvisoryStatusMap: async () => {
    // fetch advisory statuses
    const advisoryStatus = await strapi.entityService.findMany(
      "api::advisory-status.advisory-status", {
      limit: -1,
      populate: "*",
    }
    );
    const advisoryStatusMap = {};
    advisoryStatus.forEach(a => {
      advisoryStatusMap[a.code] = a;
    });
    return advisoryStatusMap;
  }
});
