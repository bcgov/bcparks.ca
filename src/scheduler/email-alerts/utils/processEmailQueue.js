// email-alerts/utils/processEmailQueue.js
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

const THROTTLE_MINUTES = 10;

/**
 * Generic queued-email processor.
 * @param {object} config email type settings and functions
 * @param {string} config.action task-queue action to read
 * @param {string} config.templatePath EJS template path
 * @param {string} config.label label used in logs
 * @param {(msg) => string} config.getDedupeKey returns the duplicate check key
 * @param {(msg) => Promise<object>} config.buildEmailData returns template data
 * @param {(msg) => string[]} config.getRecipients returns "To" addresses
 * @param {(msg) => string[]} [config.getCCRecipients] returns "CC" addresses
 * @param {(data) => string} config.getSummaryText returns summary text
 * @param {(msg) => string} config.getTestFileName returns emailtest file path
 * @param {object[]} recent recently sent records for throttle purposes
 * @returns {Promise<object[]|undefined>} updated list of recently sent records
 */
async function processEmailQueue(config, recent = []) {
  const logger = getLogger();
  const sent = [];

  const isProduction = process.env.BCPARKS_ENVIRONMENT === "prod";
  const emailEnabled = process.env.EMAIL_ENABLED?.toLowerCase() === "true";
  const shouldSend = scriptKeySpecified("emailsend") || noCommandLineArgs();

  let queue;
  try {
    queue = await readQueue(config.action);
  } catch (error) {
    logger.error(
      `processEmailQueue() failed while retrieving '${config.action}' tasks: ${error}`,
    );
    return;
  }

  for (const message of queue) {
    const dedupeKey = config.getDedupeKey(message);
    const isDuplicate = [...recent, ...sent].some(
      (email) => email.dedupeKey === dedupeKey,
    );

    if (isDuplicate) {
      logger.info(
        `Skipped ${config.label} email "${dedupeKey}" because a duplicate was sent recently. Email not sent.`,
      );
    } else {
      const emailData = await config.buildEmailData(message);

      const recipients = [
        ...new Set(
          config
            .getRecipients(message)
            .map((r) => r.trim())
            .filter(Boolean),
        ),
      ];

      const ccRecipients = [
        ...new Set(
          (config.getCCRecipients?.(message) || [])
            .map((r) => r.trim())
            .filter(Boolean),
        ),
      ];

      if (scriptKeySpecified("emailtest")) {
        emailData.debugToRecipients = recipients;
        emailData.debugCcRecipients = ccRecipients;
      }

      const htmlMessageBody = await ejs.renderFile(
        config.templatePath,
        emailData,
      );

      if (scriptKeySpecified("emailtest")) {
        await writeFile(config.getTestFileName(message), htmlMessageBody);
      }

      if (shouldSend && emailEnabled) {
        // prevent spamming real users from non-production environments
        const recipientsToSend = filterRecipientsByEnvironment(
          recipients,
          logger,
          `${config.label} email ${dedupeKey}`,
        );
        const recipientsToCC = filterRecipientsByEnvironment(
          ccRecipients,
          logger,
          `${config.label} CC ${dedupeKey}`,
          true,
        );

        if (recipientsToSend.length || recipientsToCC.length) {
          const summary = convert(config.getSummaryText(emailData), {
            wordwrap: false,
          });

          await send(
            emailData.subject,
            htmlMessageBody,
            summary,
            getSenderName(),
            recipientsToSend,
            recipientsToCC,
            getLogoAttachment(),
          );

          sent.push({ dedupeKey, lastEmailSent: new Date().toISOString() });
        }
      }
    }

    // Remove processed messages except when production email is disabled.
    // In production, EMAIL_ENABLED=false acts as a kill switch and preserves
    // the queue for later retry.
    const shouldRemoveFromQueue = shouldSend && (!isProduction || emailEnabled);

    if (shouldRemoveFromQueue) {
      await removeFromQueue([message.documentId]);
    }
  }

  const throttleCutoff = new Date(
    Date.now() - 1000 * 60 * THROTTLE_MINUTES,
  ).toISOString();

  return [
    ...recent.filter((email) => email.lastEmailSent > throttleCutoff),
    ...sent,
  ];
}

module.exports = { processEmailQueue };
