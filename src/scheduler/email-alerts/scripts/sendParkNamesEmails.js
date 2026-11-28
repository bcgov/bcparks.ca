const { getLogger } = require("../../shared/logging");
const { readQueue, removeFromQueue } = require("../../shared/taskQueue");
const ejs = require("ejs");
const { writeFile } = require("node:fs").promises;
const {
  scriptKeySpecified,
  noCommandLineArgs,
} = require("../../shared/commandLine");
const { send } = require("../../shared/email/mailer");
const {
  getSenderName,
  getLogoAttachment,
} = require("../../shared/email/emailHelper");

/**
 * Sends queued emails
 */
exports.sendParkNamesEmails = async function () {
  let queue;
  const logger = getLogger();
  const isProduction = process.env.BCPARKS_ENVIRONMENT === "prod";
  const emailEnabled = process.env.EMAIL_ENABLED?.toLowerCase() === "true";

  const shouldSend = scriptKeySpecified("emailsend") || noCommandLineArgs();

  // get items from the queue with the action 'email parkname change'
  try {
    queue = await readQueue("email parkname change");
  } catch (error) {
    logger.error(
      `sendParkNamesEmails() failed while retrieving 'email parkname change' tasks: ${error}`,
    );
    return;
  }

  for (const message of queue) {
    try {
      const orcs = message?.numericData;
      const jsonData = message?.jsonData;

      // render the email template
      const htmlMessageBody = await ejs.renderFile(
        "./email-alerts/templates/parkname-change.ejs",
        jsonData,
      );

      if (scriptKeySpecified("emailtest")) {
        await writeFile(`./mail-test-${orcs}.html`, htmlMessageBody);
      }

      if (shouldSend && emailEnabled) {
        const subject = `A park name was changed`;
        const summary = `${jsonData.oldName} was changed to ${jsonData.newName}`;
        // Split EMAIL_RECIPIENT because it can be a comma-separated list
        const recipients = (process.env.EMAIL_RECIPIENT || "")
          .split(",")
          .filter(Boolean);

        await send(
          subject,
          htmlMessageBody,
          summary,
          getSenderName(),
          [...recipients],
          [],
          getLogoAttachment(),
        );
      }

      // Remove processed messages except when production email is disabled.
      // In production, EMAIL_ENABLED=false acts as a kill switch and preserves
      // the queue for later retry.
      const shouldRemoveFromQueue =
        shouldSend && (!isProduction || emailEnabled);

      if (shouldRemoveFromQueue) {
        await removeFromQueue([message.documentId]);
      }
    } catch (error) {
      // leave the task in the queue so it is retried, and carry on with the
      // rest so one bad email does not block the others
      logger.error(
        `sendParkNamesEmails() failed while processing park ${message?.numericData}: ${error}`,
        message.documentId,
      );
    }
  }
};
