const { getLogger } = require("../../shared/logging");
const { cmsAxios } = require("../../shared/axiosConfig");
const { readQueue, removeFromQueue } = require("../../shared/taskQueue");
const qs = require("qs");
const ejs = require("ejs");
const { writeFile } = require("fs");
const { parseJSON } = require("date-fns");
const { formatInTimeZone } = require("date-fns-tz");
const {
  scriptKeySpecified,
  noCommandLineArgs,
} = require("../../shared/commandLine");
const { send } = require("./mailer");
const { buildEmailMetadata } = require("./advisoryEmailMetadata");

/**
 * Sends queued emails
 */
exports.sendAdvisoryEmails = async function (recentAdvisoryEmails) {
  const THROTTLE_MINUTES = 10; // min. time before sending 2 emails about 1 advisory
  let queue;
  let sent = [];
  const logger = getLogger();

  if (!recentAdvisoryEmails) {
    recentAdvisoryEmails = [];
  }

  // get items from the queue with the action 'email advisory'
  try {
    queue = await readQueue("email advisory");
  } catch (error) {
    logger.error(
      `sendAdvisoryEmails() failed while retrieving 'email advisory' tasks: ${error}`,
    );
    return;
  }

  for (const message of queue) {
    const advisoryNumber = message?.numericData;
    if (
      !recentAdvisoryEmails.find((e) => e.advisoryNumber === advisoryNumber)
    ) {
      sent.push({
        advisoryNumber: advisoryNumber,
        lastEmailSent: new Date().toISOString(),
      });
      const emailInfo = message?.jsonData;

      const advisory = (await getAdvisoryInfo(advisoryNumber))[0];
      const metadata = buildEmailMetadata(advisory, emailInfo?.metadataFields);

      let dateLabel = "";
      let dateString = "";

      const tz = "America/Vancouver";
      const fmt = "MMMM dd, yyyy hh:mm a";

      if (advisory.isAdvisoryDateDisplayed) {
        dateLabel = "Posted";
        dateString = formatInTimeZone(
          parseJSON(advisory.advisoryDate),
          tz,
          fmt,
        );
      } else if (advisory.isUpdatedDateDisplayed) {
        dateLabel = "Updated";
        dateString = formatInTimeZone(parseJSON(advisory.updatedDate), tz, fmt);
      } else if (
        advisory.isEffectiveDateDisplayed &&
        advisory.isEndDateDisplayed
      ) {
        const effectiveDate = parseJSON(advisory.effectiveDate);
        const endDate = parseJSON(advisory.endDate);
        dateLabel = "In effect";
        dateString = `${formatInTimeZone(effectiveDate, tz, fmt)} to ${formatInTimeZone(
          endDate,
          tz,
          fmt,
        )}`;
      } else if (advisory.isEffectiveDateDisplayed) {
        dateLabel = "In effect";
        dateString = formatInTimeZone(
          parseJSON(advisory.effectiveDate),
          tz,
          fmt,
        );
      }

      const emailData = {
        ...emailInfo,
        ...{
          data: advisory,
          metadata,
          dateLabel: dateLabel,
          dateString: dateString,
          publicUrl: process.env.PUBLIC_URL,
          adminUrl: process.env.ADMIN_URL,
        },
      };

      // render the email template
      const htmlMessageBody = await ejs.renderFile(
        "./email-alerts/templates/public-advisory.ejs",
        emailData,
      );

      if (scriptKeySpecified("emailtest")) {
        writeFile(
          `./mail-test-${advisoryNumber}.html`,
          htmlMessageBody,
          (err) => {
            if (err) throw err;
          },
        );
      }

      if (scriptKeySpecified("emailsend") || noCommandLineArgs()) {
        if (process.env.EMAIL_ENABLED.toLowerCase() !== "false") {
          const environmentName = process.env.BCPARKS_ENVIRONMENT || "local";
          const environment = environmentName.toLowerCase();
          const subject = emailData.subject;
          const summary = emailData.data.description.replace(
            /(<([^>]+)>)/gi,
            "",
          );
          const fromName =
            environment === "prod"
              ? "Staff Web Portal"
              : environmentName.toUpperCase();

          // Build recipients list for this email
          const recipients = [
            // Split EMAIL_RECIPIENT because it can be a comma-separated list
            ...(process.env.EMAIL_RECIPIENT || "").split(","),
            ...(emailInfo.additionalRecipients ?? []),
          ].filter(Boolean);

          // Deduplicate recipients list
          const uniqueRecipients = [...new Set(recipients)];

          let recipientsToSend = uniqueRecipients;

          // In non-production environments, only send to recipients in EMAIL_RECIPIENT_WHITELIST.
          if (environment !== "prod") {
            const whitelist = (process.env.EMAIL_RECIPIENT_WHITELIST || "")
              .split(",")
              .map((recipient) => recipient.toLowerCase())
              .filter(Boolean);
            const whitelistSet = new Set(whitelist);

            if (!whitelist.length) {
              logger.error(
                `Skipping advisory email ${advisoryNumber} in '${process.env.BCPARKS_ENVIRONMENT}' because EMAIL_RECIPIENT_WHITELIST is empty.`,
              );
              continue;
            }

            // Filter recipients against the whitelist
            recipientsToSend = uniqueRecipients.filter((recipient) =>
              whitelistSet.has(recipient.toLowerCase()),
            );

            // Log a warning for any recipients that were filtered out
            for (const recipient of uniqueRecipients) {
              if (!whitelistSet.has(recipient.toLowerCase())) {
                logger.warn(
                  `Non-prod recipient filtered out for advisory ${advisoryNumber} in '${process.env.BCPARKS_ENVIRONMENT}': ${recipient}`,
                );
              }
            }

            if (!recipientsToSend.length) {
              logger.error(
                `Skipping advisory email ${advisoryNumber} in '${process.env.BCPARKS_ENVIRONMENT}' because no recipients matched EMAIL_RECIPIENT_WHITELIST.`,
              );
              continue;
            }
          }

          // Attach the Ministry of Environment & BC Parks logo as logo.png
          const attachments = [
            {
              path: "./email-alerts/images/logo-moe-parks.png",
              cid: "logo.png",
            },
          ];

          await send(
            subject,
            htmlMessageBody,
            summary,
            fromName,
            recipientsToSend,
            attachments,
          );
        }
      }
    }
    if (scriptKeySpecified("emailsend") || noCommandLineArgs()) {
      await removeFromQueue([message.documentId]);
    }
  }

  // prune the list of recentAdvisoryEmails to THROTTLE_MINUTES and return
  const throttleMinutesAgo = new Date(
    Date.now() - 1000 * 60 * THROTTLE_MINUTES,
  ).toISOString();

  return [
    ...recentAdvisoryEmails.filter((a) => a.lastEmailSent > throttleMinutesAgo),
    ...sent,
  ];
};

const getAdvisoryInfo = async function (advisoryNumber) {
  const advisoryFilter = qs.stringify(
    {
      populate: {
        fireCentres: { fields: ["fireCentreName"] },
        fireZones: { fields: ["fireZoneName"] },
        naturalResourceDistricts: { fields: ["naturalResourceDistrictName"] },
        links: {
          fields: ["title", "url"],
        },
        managementAreas: { fields: ["managementAreaName"] },
        protectedAreas: { fields: ["protectedAreaName", "slug"] },
        regions: { fields: ["regionName"] },
        sections: { fields: ["sectionName"] },
        sites: {
          fields: ["siteName", "slug"],
          populate: { protectedArea: { fields: "slug" } },
        },
        standardMessages: { fields: ["description"] },
        urgency: { fields: ["urgency"] },
      },
      filters: {
        $and: [{ isLatestRevision: true }, { advisoryNumber: advisoryNumber }],
      },
    },
    {
      encodeValuesOnly: true,
    },
  );
  const advisoryQuery = `/api/public-advisory-audits?${advisoryFilter}`;
  const response = await cmsAxios.get(advisoryQuery, {
    headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
  });
  return response.data.data;
};
