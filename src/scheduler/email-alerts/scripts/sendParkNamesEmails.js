const { getLogger } = require("../../shared/logging");
const { readQueue, removeFromQueue } = require("../../shared/taskQueue");
const ejs = require("ejs");
const { writeFile } = require("fs");
const { scriptKeySpecified, noCommandLineArgs } = require("../../shared/commandLine");
const { send } = require("./mailer");

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
      `sendParkNamesEmails() failed while retrieving 'email parkname change' tasks: ${error}`
    );
    return;
  }

  for (const message of queue) {
    const orcs = message.attributes?.numericData;
    const jsonData = message.attributes?.jsonData;

    // render the email template
    const htmlMessageBody = await ejs.renderFile(
      "./email-alerts/templates/parkname-change.ejs",
      jsonData
    );

    if (scriptKeySpecified("emailtest")) {
      writeFile(`./mail-test-${orcs}.html`, htmlMessageBody, (err) => {
        if (err) throw err;
      });
    }

    if (scriptKeySpecified("emailsend") || noCommandLineArgs()) {
      if (process.env.EMAIL_ENABLED.toLowerCase() !== "false") {
        const subject = `A Protected Area Name Was Changed`;
        const summary = `${jsonData.oldName} was changed to ${jsonData.newName}`;
        const fromName =
          process.env.BCPARKS_ENVIRONMENT.toLowerCase() === "prod"
            ? "Staff Web Portal"
            : process.env.BCPARKS_ENVIRONMENT.toUpperCase();
        await send(subject, htmlMessageBody, summary, fromName);
      }
    }

    if (scriptKeySpecified("emailsend") || noCommandLineArgs()) {
      await removeFromQueue([message.id]);
    }
  }
};
