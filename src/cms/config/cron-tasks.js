"use strict";

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */
const _ = require("lodash");

module.exports = {
  // Execute the cron at 2 minutes past every hour.
  // BCGW replication is hourly at 10 minutes past the hour
  cronJob: {
    task: async ({ strapi }) => {
      const startTime = +new Date();

      // fetch advisory statuses
      const advisoryStatus = await strapi.entityService.findMany(
        "api::advisory-status.advisory-status", {
          limit: -1,
          populate: "*",
        }
      );

      if (advisoryStatus.length > 0) {
        const advisoryStatusMap = {};
        advisoryStatus.map((a) => {
          advisoryStatusMap[a.code] = a;
          return advisoryStatusMap;
        });
        // fetch advisories to publish - audit table
        const draftAdvisoryToPublishAudit = await strapi.entityService.findMany(
          "api::public-advisory-audit.public-advisory-audit", {
            filters: {
              isLatestRevision: true,
              advisoryDate: {
                $lte: new Date()
              },
              advisoryStatus: advisoryStatusMap["APR"].id,
            },
            publicationState: "live",
            populate: "*",
          }
        );

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
            .catch((error) => {
              strapi.log.error(
                `error updating public-advisory-audit #${advisory.advisoryNumber}`,
                error
              );
            });
        });

        // fetch advisories to unpublish - public advisory table
        const advisoryToUnpublish = await strapi.entityService.findMany(
          "api::public-advisory.public-advisory", {
            filters: {
              expiryDate: {
                $lte: new Date()
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

      strapi.log.info(`Strapi cron finished in ${+new Date() - startTime}ms`);
    },
    options: {
      rule: "*/2 * * * *",
      tz: "America/Vancouver",
    },
  },
};
