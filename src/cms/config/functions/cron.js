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
      const advisoryStatusMap = {};
      advisoryStatus.map((a) => {
        advisoryStatusMap[a.code] = a;
        return advisoryStatusMap;
      });
      // fetch advisories to publish
      const draftAdvisoryToPublish = await strapi.api[
        "public-advisory"
      ].services["public-advisory"].find({
        _publicationState: "preview",
        advisoryDate_lte: new Date(),
        advisoryStatus: advisoryStatusMap["APR"].id,
      });

      // publish advisories
      draftAdvisoryToPublish.forEach(async (advisory) => {
        await strapi.api["public-advisory"].services["public-advisory"].update(
          { id: advisory.id },
          {
            published_at: advisory.advisoryDate,
            advisoryStatus: advisoryStatusMap["PUB"],
            modifiedBy: "system",
            modifiedDate: new Date(),
          }
        );
      });

      // fetch advisories to unpublish
      const advisoryToUnpublish = await strapi.api["public-advisory"].services[
        "public-advisory"
      ].find({
        _publicationState: "live",
        expiryDate_lte: new Date(),
        advisoryStatus: advisoryStatusMap["PUB"].id,
      });

      // unpublish advisories
      advisoryToUnpublish.forEach(async (advisory) => {
        await strapi.api["public-advisory"].services["public-advisory"].update(
          { id: advisory.id },
          {
            published_at: null,
            advisoryStatus: advisoryStatusMap["INA"],
            removalDate: new Date(),
            modifiedBy: "system",
            modifiedDate: new Date(),
          }
        );
      });
    },
    options: {
      tz: "America/Vancouver",
    },
  },
};
