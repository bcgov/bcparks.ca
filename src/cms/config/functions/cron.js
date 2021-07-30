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

module.exports = {
  "*/5 * * * *": {
    task: async () => {
      // fetch advisory statuses
      const advisoryStatus = await strapi.api["advisory-status"].services[
        "advisory-status"
      ].find();
      if (advisoryStatus.length > 0) {
        const advisoryStatusMap = {};
        advisoryStatus.map((a) => {
          advisoryStatusMap[a.code] = a;
          return advisoryStatusMap;
        });
        // fetch advisories to publish - audit table
        const draftAdvisoryToPublishAudit = await strapi.api[
          "public-advisory-audit"
        ].services["public-advisory-audit"].find({
          _publicationState: "live",
          isLatestRevision: true,
          advisoryDate_lte: new Date(),
          advisoryStatus: advisoryStatusMap["APR"].id,
        });

        // publish advisories - audit table
        draftAdvisoryToPublishAudit.forEach(async (advisory) => {
          await strapi.api["public-advisory-audit"].services[
            "public-advisory-audit"
          ].update(
            { id: advisory.id },
            {
              published_at: advisory.advisoryDate,
              advisoryStatus: advisoryStatusMap["PUB"].id,
              modifiedBy: "system",
              modifiedDate: new Date(),
              removalDate: null,
            }
          );
        });

        // fetch advisories to unpublish - public advisory table
        const advisoryToUnpublish = await strapi.api[
          "public-advisory"
        ].services["public-advisory"].find({
          _publicationState: "live",
          expiryDate_lte: new Date(),
          advisoryStatus: advisoryStatusMap["PUB"].id,
        });

        // unpublish advisories - audit table
        advisoryToUnpublish.forEach(async (advisory) => {
          await strapi.api["public-advisory-audit"].services[
            "public-advisory-audit"
          ].update(
            {
              advisoryNumber: advisory.advisoryNumber,
              isLatestRevision: true,
            },
            {
              published_at: new Date(),
              advisoryStatus: advisoryStatusMap["INA"].id,
              removalDate: new Date(),
              modifiedBy: "system",
              modifiedDate: new Date(),
            }
          );
        });
      }
    },
    options: {
      tz: "America/Vancouver",
    },
  },
};
