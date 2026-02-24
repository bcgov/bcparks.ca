"use strict";

/**
 * public advisory scheduling service
 */

const { queueAdvisoryEmail } = require("../../../helpers/taskQueue.js");

module.exports = ({ strapi }) => ({
  expire: async (advisoryStatusMap) => {
    let expiredAdvisoryCount = 0;

    if (Object.keys(advisoryStatusMap).length > 0) {
      // fetch advisories to unpublish - public advisory table
      const advisoryToUnpublish = await strapi
        .documents("api::public-advisory.public-advisory")
        .findMany({
          filters: {
            expiryDate: {
              $lte: new Date().toISOString(),
            },
            advisoryStatus: advisoryStatusMap["PUB"].id,
          },
          populate: "*",
        });

      // delete advisories - public advisory table
      advisoryToUnpublish.forEach(async (advisory) => {
        strapi.log.info(
          `unpublishing public-advisory [advisoryNumber:${advisory.advisoryNumber}]`,
        );
        await strapi
          .documents("api::public-advisory.public-advisory")
          .update({
            documentId: advisory.documentId,
            data: {
              publishedAt: null,
            },
          })
          .then(async (advisory) => {
            expiredAdvisoryCount++;
            await queueAdvisoryEmail(
              "Expired advisory removed",
              "An expired advisory was removed",
              advisory.advisoryNumber,
              "public-advisory-audit::services::scheduling::expire()",
            );
          })
          .catch((error) => {
            strapi.log.error(
              `error updating public-advisory #${advisory.advisoryNumber}`,
              error,
            );
          });
      });

      // unpublish advisories - audit table
      advisoryToUnpublish.forEach(async (advisory) => {
        const advisoryAudit = await strapi
          .documents("api::public-advisory-audit.public-advisory-audit")
          .findMany({
            filters: {
              advisoryNumber: advisory.advisoryNumber,
              isLatestRevision: true,
            },
          });
        if (advisoryAudit.length) {
          strapi.log.info(
            `setting public-advisory-audit to inactive [advisoryNumber:${advisory.advisoryNumber}]`,
          );
          await strapi
            .documents("api::public-advisory-audit.public-advisory-audit")
            .update({
              documentId: advisoryAudit[0].documentId,
              data: {
                publishedAt: new Date(),
                advisoryStatus: {
                  id: advisoryStatusMap["INA"].id,
                },
                removalDate: new Date(),
                modifiedBy: "system",
                modifiedDate: new Date(),
              },
            })
            .catch((error) => {
              strapi.log.error(
                `error updating public-advisory-audit #${advisory.advisoryNumber}`,
                error,
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
      const draftAdvisoryToPublishAudit = await strapi
        .documents("api::public-advisory-audit.public-advisory-audit")
        .findMany({
          filters: {
            isLatestRevision: true,
            advisoryDate: {
              $lte: new Date().toISOString(),
            },
            advisoryStatus: advisoryStatusMap["APR"].id,
          },
          populate: "*",
        });

      let publishedAdviosryCount = 0;

      // publish advisories - audit table
      draftAdvisoryToPublishAudit.forEach(async (advisory) => {
        strapi.log.info(
          `publishing approved public-advisory-audit [advisoryNumber:${advisory.advisoryNumber}]`,
        );
        await strapi
          .documents("api::public-advisory-audit.public-advisory-audit")
          .update({
            documentId: advisory.documentId,
            data: {
              publishedAt: advisory.advisoryDate,
              advisoryStatus: {
                id: advisoryStatusMap["PUB"].id,
              },
              modifiedBy: "system",
              modifiedDate: new Date(),
              removalDate: null,
            },
          })
          .then(async (advisory) => {
            publishedAdviosryCount++;
            await queueAdvisoryEmail(
              "Scheduled advisory posted",
              "A scheduled advisory was posted",
              advisory.advisoryNumber,
              "public-advisory-audit::services::scheduling::publish()",
            );
          })
          .catch((error) => {
            strapi.log.error(
              `error updating public-advisory-audit #${advisory.advisoryNumber}`,
              error,
            );
          });
      });

      return publishedAdviosryCount;
    }
  },

  expiringSoon: async (advisoryStatusMap) => {
    if (Object.keys(advisoryStatusMap).length > 0) {
      const today = new Date();
      const nextWeek = new Date(
        today.setTime(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      );
      const rangeStart = new Date(
        nextWeek.setTime(nextWeek.getTime() - 60 * 1000),
      ).toISOString();
      const rangeEnd = new Date(
        nextWeek.setTime(nextWeek.getTime() + 120 * 1000),
      ).toISOString();
      const expiringSoon = await strapi
        .documents("api::public-advisory-audit.public-advisory-audit")
        .findMany({
          filters: {
            $and: [
              {
                isLatestRevision: true,
              },
              {
                expiryDate: { $gte: rangeStart },
              },
              {
                expiryDate: { $lte: rangeEnd },
              },
              {
                advisoryStatus: advisoryStatusMap["PUB"].id,
              },
            ],
          },
        });
      expiringSoon.forEach(async (advisory) => {
        strapi.log.info(
          `advisory expiring soon [advisoryNumber:${advisory.advisoryNumber}]`,
        );
        await queueAdvisoryEmail(
          "Advisory expiring soon",
          "This advisory will be expiring in one week",
          advisory.advisoryNumber,
          "public-advisory-audit::services::scheduling::expiringSoon()",
        );
      });
      return expiringSoon.length;
    }
    return 0;
  },

  publishingSoon: async (advisoryStatusMap) => {
    if (Object.keys(advisoryStatusMap).length > 0) {
      let totalPublishingSoon = 0;
      const reminders = [
        { daysBefore: 5, message: "This advisory will go live in 5 days" },
        { daysBefore: 2, message: "This advisory will go live in 2 days" },
      ];
      for (const reminder of reminders) {
        const today = new Date();
        const reminderDate = new Date(
          today.setTime(
            today.getTime() + reminder.daysBefore * 24 * 60 * 60 * 1000,
          ),
        );
        const rangeStart = new Date(
          reminderDate.setTime(reminderDate.getTime() - 60 * 1000),
        ).toISOString();
        const rangeEnd = new Date(
          reminderDate.setTime(reminderDate.getTime() + 120 * 1000),
        ).toISOString();
        const publishingSoon = await strapi
          .documents("api::public-advisory-audit.public-advisory-audit")
          .findMany({
            filters: {
              $and: [
                {
                  isLatestRevision: true,
                },
                {
                  advisoryDate: { $gte: rangeStart },
                },
                {
                  advisoryDate: { $lte: rangeEnd },
                },
                {
                  advisoryStatus: advisoryStatusMap["APR"].id,
                },
              ],
            },
          });
        publishingSoon.forEach(async (advisory) => {
          strapi.log.info(
            `advisory going live soon [advisoryNumber:${advisory.advisoryNumber}]`,
          );
          await queueAdvisoryEmail(
            "Advisory going live soon",
            reminder.message,
            advisory.advisoryNumber,
            "public-advisory-audit::services::scheduling::publishingSoon()",
          );
        });
        totalPublishingSoon += publishingSoon.length;
      }
      return totalPublishingSoon;
    }
    return 0;
  },

  getAdvisoryStatusMap: async () => {
    // fetch advisory statuses
    const advisoryStatus = await strapi
      .documents("api::advisory-status.advisory-status")
      .findMany({
        limit: -1,
        populate: "*",
      });
    const advisoryStatusMap = {};
    advisoryStatus.forEach((a) => {
      advisoryStatusMap[a.code] = a;
    });
    return advisoryStatusMap;
  },
});
