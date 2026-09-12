const { getLogger } = require("../../shared/logging");
const { readQueue, removeFromQueue } = require("../../shared/taskQueue");
const ejs = require("ejs");
const { writeFile } = require("node:fs").promises;
const { convert } = require("html-to-text");
const {
  scriptKeySpecified,
  noCommandLineArgs,
} = require("../../shared/commandLine");
const { send } = require("../utils/mailer");
const { buildEmailMetadata } = require("../utils/advisoryEmailMetadata");
const {
  filterRecipientsByEnvironment,
  getLogoAttachment,
  getSenderName,
} = require("../utils/emailHelper");
const {
  getAdvisoryInfo,
  getAdvisoryDateInfo,
} = require("../utils/advisoryMailHelper");

/**
 * Sends queued advisory emails
 */
exports.sendAdvisoryEmails = async function (recentAdvisoryEmails) {
  const THROTTLE_MINUTES = 10; // min. time before sending duplicate emails for an advisory+subject
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
    const throttleSubject = message?.jsonData?.subject || "";

    if (
      !recentAdvisoryEmails.find(
        (email) =>
          email.advisoryNumber === advisoryNumber &&
          email.subject === throttleSubject,
      )
    ) {
      sent.push({
        advisoryNumber: advisoryNumber,
        subject: throttleSubject,
        lastEmailSent: new Date().toISOString(),
      });
      const emailInfo = message?.jsonData;

      const advisory = (await getAdvisoryInfo(advisoryNumber))[0];
      const metadata = buildEmailMetadata(advisory, emailInfo?.metadataFields);
      const { dateLabel, dateString } = getAdvisoryDateInfo(advisory);

      // Add Rec Sites & Trails Resource links where applicable
      const recResources = advisory.recreationResources ?? [];
      advisory.recreationResources = recResources.map((resource) => {
        // Build the sitesandtrailsbc.ca deep-link using the same logic as the frontend:
        // Only if isDisplayed is true, and recResourceId is present
        const link =
          resource.isDisplayed && resource.recResourceId
            ? `https://www.sitesandtrailsbc.ca/resource/${encodeURIComponent(resource.recResourceId)}`
            : null;
        return { ...resource, link };
      });

      const emailData = {
        ...emailInfo,
        data: advisory,
        metadata,
        dateLabel: dateLabel,
        dateString: dateString,
        adminUrl: process.env.ADMIN_URL,
      };

      if (scriptKeySpecified("emailtest")) {
        // For testing, add all recipient addresses to emailData
        // so they can be included in the rendered document for verification.
        emailData.allRecipients = [
          ...(process.env.EMAIL_RECIPIENT || "").split(","),
          ...(emailInfo.additionalRecipients ?? []),
        ].filter(Boolean);
      }

      // render the email template
      const htmlMessageBody = await ejs.renderFile(
        "./email-alerts/templates/public-advisory.ejs",
        emailData,
      );

      if (scriptKeySpecified("emailtest")) {
        await writeFile(
          `./mail-test-advisory-${advisoryNumber}-${message.documentId}.html`,
          htmlMessageBody,
          (err) => {
            if (err) throw err;
          },
        );
      }

      if (scriptKeySpecified("emailsend") || noCommandLineArgs()) {
        if (process.env.EMAIL_ENABLED.toLowerCase() !== "false") {
          const subject = emailData.subject;
          const summary = convert(emailData.data.description, {
            wordwrap: false,
          });

          // Build recipients list for this email
          const recipients = [
            // Split EMAIL_RECIPIENT because it can be a comma-separated list
            ...(process.env.EMAIL_RECIPIENT || "").split(","),
            ...(emailInfo.additionalRecipients ?? []),
          ]
            .map((recipient) => recipient.trim())
            .filter(Boolean);

          // Deduplicate recipients list
          const uniqueRecipients = [...new Set(recipients)];

          // In non-production environments, only send to recipients in EMAIL_RECIPIENT_WHITELIST.
          const recipientsToSend = filterRecipientsByEnvironment(
            uniqueRecipients,
            logger,
            `advisory email ${advisoryNumber}`,
          );

          await send(
            subject,
            htmlMessageBody,
            summary,
            getSenderName(),
            recipientsToSend,
            getLogoAttachment(),
          );
        }
      }
    } else {
      logger.info(
        `Skipped advisory email ${advisoryNumber} with subject "${throttleSubject}" because a duplicate was sent recently. Email not sent.`,
      );
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
    ...recentAdvisoryEmails.filter(
      (email) => email.lastEmailSent > throttleMinutesAgo,
    ),
    ...sent,
  ];
};
