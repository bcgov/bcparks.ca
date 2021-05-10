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
        advisoryStatusMap[a.Code] = a;
        return advisoryStatusMap;
      });

      // fetch advisories to publish
      const draftAdvisoryToPublish = await strapi.api[
        "public-advisory"
      ].services["public-advisory"].find({
        _publicationState: "preview",
        AdvisoryDate_lte: new Date(),
        AdvisoryStatus: advisoryStatusMap["APR"].id,
      });

      // publish advisories
      draftAdvisoryToPublish.forEach(async (advisory) => {
        await strapi.api["public-advisory"].services["public-advisory"].update(
          { id: advisory.id },
          {
            published_at: advisory.AdvisoryDate,
            AdvisoryStatus: advisoryStatusMap["PUB"],
            ModifiedBy: "system",
            ModifiedDate: new Date(),
          }
        );
      });

      // fetch advisories to unpublish
      const advisoryToUnpublish = await strapi.api["public-advisory"].services[
        "public-advisory"
      ].find({
        _publicationState: "live",
        ExpiryDate_lte: new Date(),
        AdvisoryStatus: advisoryStatusMap["PUB"].id,
      });

      // unpublish advisories
      advisoryToUnpublish.forEach(async (advisory) => {
        await strapi.api["public-advisory"].services["public-advisory"].update(
          { id: advisory.id },
          {
            published_at: null,
            AdvisoryStatus: advisoryStatusMap["INA"],
            RemovalDate: new Date(),
            ModifiedBy: "system",
            ModifiedDate: new Date(),
          }
        );
      });
    },
    options: {
      tz: "America/Vancouver",
    },
  },
};
