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
      console.log("CRON STARTING");

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
          );
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

        // unpublish advisories - public advisory table
        advisoryToUnpublish.forEach(async (advisory) => {
          await strapi.entityService.update(
            "api::public-advisory.public-advisory", advisory.id, {
              data: {
                publishedAt: null,
                advisoryStatus: {
                  id: advisoryStatusMap["INA"].id
                },
                removalDate: new Date(),
                modifiedBy: "system",
                modifiedDate: new Date(),
              }
            }
          )
        });

        // inactivate advisories - audit table
        advisoryToUnpublish.forEach(async (advisory) => {
          await strapi.entityService.update(
            "api::public-advisory-audit.public-advisory-audit", advisory.id, {
              data: {
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
              `error updating public-advisory-audit, advisory-number: ${advisory.advisoryNumber}`,
              error
            );
          });
        });
      }

      console.log("CRON FINISHED");
    },
    options: {
      rule: "*/2 * * * *",
      tz: "America/Vancouver",
    },
  },
};
