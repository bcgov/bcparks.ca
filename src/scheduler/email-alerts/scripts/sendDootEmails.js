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
const {
  filterRecipientsByEnvironment,
  getLogoAttachment,
  getSenderName,
} = require("../utils/emailHelper");
const {
  getEmailContentByType,
  getEditTargetLabel,
} = require("../utils/dootMailHelper");

/**
 * Sends queued DOOT emails
 */
exports.sendDootEmails = async function (recentDootEmails) {
  const THROTTLE_MINUTES = 10; // min. time before sending duplicate emails for an season+emailType
  let queue;
  let sent = [];
  const logger = getLogger();

  if (!recentDootEmails) {
    recentDootEmails = [];
  }

  // get items from the queue with the action 'email doot notification'
  try {
    queue = await readQueue("email doot notification");
  } catch (error) {
    logger.error(
      `sendDootEmails() failed while retrieving 'email doot notification' tasks: ${error}`,
    );
    return;
  }

  for (const message of queue) {
    const seasonId = message?.numericData;
    const emailType = message?.jsonData?.emailType || "";

    if (
      !recentDootEmails.find(
        (email) => email.seasonId === seasonId && email.emailType === emailType,
      )
    ) {
      sent.push({
        seasonId: seasonId,
        emailType: emailType,
        lastEmailSent: new Date().toISOString(),
      });
      const emailInfo = message?.jsonData;

      const { subject, descriptionTemplate, ...emailContent } =
        getEmailContentByType(emailInfo);

      const parkSeasonEditTarget = getEditTargetLabel(emailInfo);

      const description = ejs.render(descriptionTemplate, {
        parkOperatorName: emailInfo.parkOperatorName || "",
        parkSeasonEditTarget,
      });

      const emailData = {
        ...emailInfo,
        ...emailContent,
        description,
        adminUrl: process.env.ADMIN_URL,
      };

      const configuredRecipients =
        Array.isArray(emailInfo.recipientEmails) &&
        emailInfo.recipientEmails.length > 0
          ? emailInfo.recipientEmails
          : (process.env.EMAIL_RECIPIENT || "").split(",");

      const uniqueRecipients = [
        ...new Set(
          configuredRecipients
            .map((recipient) => recipient.trim())
            .filter(Boolean),
        ),
      ];

      if (scriptKeySpecified("emailtest")) {
        // For testing, add all recipient addresses to emailData
        // so they can be included in the rendered document for verification.
        emailData.allRecipients = uniqueRecipients;
      }

      // render the email template
      const htmlMessageBody = await ejs.renderFile(
        "./email-alerts/templates/doot-notification.ejs",
        emailData,
      );

      if (scriptKeySpecified("emailtest")) {
        await writeFile(
          `./mail-test-doot-${seasonId}-${message.documentId}.html`,
          htmlMessageBody,
          (err) => {
            if (err) throw err;
          },
        );
      }

      if (scriptKeySpecified("emailsend") || noCommandLineArgs()) {
        if (process.env.EMAIL_ENABLED.toLowerCase() !== "false") {
          const summary = convert(description, { wordwrap: false });

          // In non-production environments, only send to recipients in EMAIL_RECIPIENT_WHITELIST.
          const recipientsToSend = filterRecipientsByEnvironment(
            uniqueRecipients,
            logger,
            `DOOT email ${seasonId}`,
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
        `Skipped DOOT email ${seasonId} with emailType "${emailType}" because a duplicate was sent recently. Email not sent.`,
      );
    }
    if (scriptKeySpecified("emailsend") || noCommandLineArgs()) {
      await removeFromQueue([message.documentId]);
    }
  }

  // prune the list of recentDootEmails to THROTTLE_MINUTES and return
  const throttleMinutesAgo = new Date(
    Date.now() - 1000 * 60 * THROTTLE_MINUTES,
  ).toISOString();

  return [
    ...recentDootEmails.filter(
      (email) => email.lastEmailSent > throttleMinutesAgo,
    ),
    ...sent,
  ];
};
