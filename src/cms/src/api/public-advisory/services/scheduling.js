"use strict";

/**
 * public advisory scheduling service
 */

const { queueAdvisoryEmail } = require("../../../helpers/taskQueue.js");

/**
 * Adds the advisory headline to the email subject.
 * @param {string} subject the base subject for the email
 * @param {object} advisoryData the advisory data
 * @param {string} advisoryData.title the title of the advisory
 * @return {string} subject with headline appended if it exists
 */
function addHeadlineToSubject(subject, advisoryData) {
  if (advisoryData.title) {
    return `${subject}: ${advisoryData.title}`;
  }

  // Return the original subject if no headline exists
  return subject;
}

module.exports = ({ strapi }) => {
  /**
   * Gets the original creator email for an advisory.
   * Returns the createdByEmail value from the first corresponding revision in public-advisory-audit.
   * @param {number} advisoryNumber the advisory number to look up
   * @returns {Promise<string|undefined>} creator email, if found
   */
  async function getCreatorEmail(advisoryNumber) {
    // Find the original advisory revision to get the submitter email.
    const advisoryAudit = await strapi
      .documents("api::public-advisory-audit.public-advisory-audit")
      .findFirst({
        filters: {
          advisoryNumber,
          revisionNumber: 1,
        },
        fields: ["createdByEmail"],
      });

    return advisoryAudit?.createdByEmail;
  }

  return {
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
        for (const advisory of advisoryToUnpublish) {
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

              const subject = addHeadlineToSubject(
                "Expired advisory / closure was removed",
                advisory,
              );

              // Find the creator email from the original advisory-audit record
              const creatorEmail = await getCreatorEmail(
                advisory.advisoryNumber,
              );

              await queueAdvisoryEmail(
                subject,
                "An expired advisory / closure was removed:",
                advisory.advisoryNumber,
                "public-advisory-audit::services::scheduling::expire()",
                creatorEmail ? [creatorEmail] : [],
              );
            })
            .catch((error) => {
              strapi.log.error(
                `error updating public-advisory #${advisory.advisoryNumber}`,
                error,
              );
            });
        }

        // unpublish advisories - audit table
        for (const advisory of advisoryToUnpublish) {
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
              `setting public-advisory-audit to unpublished [advisoryNumber:${advisory.advisoryNumber}]`,
            );
            await strapi
              .documents("api::public-advisory-audit.public-advisory-audit")
              .update({
                documentId: advisoryAudit[0].documentId,
                data: {
                  publishedAt: new Date(),
                  advisoryStatus: {
                    id: advisoryStatusMap["UNP"].id,
                  },
                  modifiedByName: "system",
                  modifiedDate: new Date(),
                  unpublishedByName: "system",
                  unpublishedDate: new Date(),
                },
              })
              .catch((error) => {
                strapi.log.error(
                  `error updating public-advisory-audit #${advisory.advisoryNumber}`,
                  error,
                );
              });
          }
        }
      }
      return expiredAdvisoryCount;
    },

    publish: async (advisoryStatusMap) => {
      let publishedAdvisoryCount = 0;

      if (Object.keys(advisoryStatusMap).length > 0) {
        // fetch advisories to publish - audit table
        const scheduledAdvisoryToPublishAudit = await strapi
          .documents("api::public-advisory-audit.public-advisory-audit")
          .findMany({
            filters: {
              isLatestRevision: true,
              advisoryDate: {
                $lte: new Date().toISOString(),
              },
              advisoryStatus: advisoryStatusMap["SCH"].id,
            },
            populate: "*",
          });

        // publish advisories - audit table
        for (const advisory of scheduledAdvisoryToPublishAudit) {
          strapi.log.info(
            `publishing scheduled public-advisory-audit [advisoryNumber:${advisory.advisoryNumber}]`,
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
                modifiedByName: "system",
                modifiedDate: new Date(),
              },
            })
            .then(async (advisory) => {
              publishedAdvisoryCount++;

              const subject = addHeadlineToSubject(
                "Scheduled advisory / closure posted",
                advisory,
              );

              await queueAdvisoryEmail(
                subject,
                "A scheduled advisory / closure was posted:",
                advisory.advisoryNumber,
                "public-advisory-audit::services::scheduling::publish()",
                advisory.createdByEmail ? [advisory.createdByEmail] : [],
              );
            })
            .catch((error) => {
              strapi.log.error(
                `error updating public-advisory-audit #${advisory.advisoryNumber}`,
                error,
              );
            });
        }
      }
      return publishedAdvisoryCount;
    },

    expiringSoon: async (advisoryStatusMap) => {
      // Use a 3-minute window 7 days before expiry to avoid missing advisories when
      // cron timing drifts. Duplicate emails are throttled in scheduler email logic
      // (THROTTLE_MINUTES), so overlap won't send multiple emails.
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const rangeStart = new Date(nextWeek.getTime() - 60 * 1000).toISOString();
      const rangeEnd = new Date(nextWeek.getTime() + 120 * 1000).toISOString();

      const expiringSoon = await strapi
        .documents("api::public-advisory.public-advisory")
        .findMany({
          filters: {
            expiryDate: { $gte: rangeStart, $lte: rangeEnd },
          },
        });

      for (const advisory of expiringSoon) {
        strapi.log.info(
          `advisory expiring soon [advisoryNumber:${advisory.advisoryNumber}]`,
        );

        const subject = addHeadlineToSubject(
          "Advisory / closure expiring soon",
          advisory,
        );

        // Find the creator email from the original advisory-audit record
        const creatorEmail = await getCreatorEmail(advisory.advisoryNumber);

        await queueAdvisoryEmail(
          subject,
          "An advisory / closure will be expiring in one week:",
          advisory.advisoryNumber,
          "public-advisory::services::scheduling::expiringSoon()",
          creatorEmail ? [creatorEmail] : [],
        );
      }
      return expiringSoon.length;
    },

    publishingSoon: async (advisoryStatusMap) => {
      let totalPublishingSoon = 0;

      if (Object.keys(advisoryStatusMap).length > 0) {
        const reminders = [
          {
            daysBefore: 7,
            message: "An advisory / closure will go live in one week:",
          },
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
                    advisoryStatus: advisoryStatusMap["SCH"].id,
                  },
                ],
              },
            });
          for (const advisory of publishingSoon) {
            strapi.log.info(
              `advisory going live soon [advisoryNumber:${advisory.advisoryNumber}]`,
            );

            const subject = addHeadlineToSubject(
              "Advisory / closure going live soon",
              advisory,
            );

            await queueAdvisoryEmail(
              subject,
              reminder.message,
              advisory.advisoryNumber,
              "public-advisory-audit::services::scheduling::publishingSoon()",
              advisory.createdByEmail ? [advisory.createdByEmail] : [],
            );
          }
          totalPublishingSoon += publishingSoon.length;
        }
      }
      return totalPublishingSoon;
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
      for (const a of advisoryStatus) {
        advisoryStatusMap[a.code] = a;
      }
      return advisoryStatusMap;
    },
  };
};
