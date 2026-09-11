const { getLogger } = require("../../shared/logging");
const { readQueue, removeFromQueue } = require("../../shared/taskQueue");
const ejs = require("ejs");
const { writeFile } = require("node:fs").promises;
const {
  scriptKeySpecified,
  noCommandLineArgs,
} = require("../../shared/commandLine");
const { send } = require("../utils/mailer");
const { getSenderName, getLogoAttachment } = require("../utils/emailHelper");

/**
 * Sends queued emails
 */
exports.sendParkNamesEmails = async function () {
  let queue;
  const logger = getLogger();

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
    const orcs = message?.numericData;
    const jsonData = message?.jsonData;

    // render the email template
    const htmlMessageBody = await ejs.renderFile(
      "./email-alerts/templates/parkname-change.ejs",
      jsonData,
    );

    if (scriptKeySpecified("emailtest")) {
      await writeFile(`./mail-test-${orcs}.html`, htmlMessageBody, (err) => {
        if (err) throw err;
      });
    }

    if (scriptKeySpecified("emailsend") || noCommandLineArgs()) {
      if (process.env.EMAIL_ENABLED.toLowerCase() !== "false") {
        const subject = `A Protected Area Name Was Changed`;
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
          getLogoAttachment(),
        );
      }
    }

    if (scriptKeySpecified("emailsend") || noCommandLineArgs()) {
      await removeFromQueue([message.documentId]);
    }
  }
};
