const { processEmailQueue } = require("../utils/processEmailQueue");
const { csvToArray } = require("../../shared/email/emailHelper");

exports.sendDootEmails = (recent) =>
  processEmailQueue(
    {
      action: "email doot",
      templatePath: "./email-alerts/templates/doot-notification.ejs",
      label: "DOOT",

      getDedupeKey: (message) => message?.jsonData?.antiDuplicateKey || "",

      // DOOT pre-builds the email content before queueing it, so this is
      // simpler than the buildEmailData function in sendAdvisoryEmails.js
      buildEmailData: async (message) => ({
        ...message?.jsonData,
        adminUrl: process.env.ADMIN_URL,
      }),

      getRecipients: (message) => {
        const emailInfo = message?.jsonData || {};

        const recipients = [
          ...csvToArray(emailInfo.sendToIS && process.env.DOOT_IS_RECIPIENT),
          ...csvToArray(emailInfo.sendToRS && process.env.DOOT_RS_RECIPIENT),
          ...(Array.isArray(emailInfo.recipientEmails)
            ? emailInfo.recipientEmails
            : []),
        ];

        return recipients.length
          ? recipients
          : csvToArray(process.env.EMAIL_RECIPIENT);
      },

      getCCRecipients: (message) => {
        const emailInfo = message?.jsonData || {};
        return [
          ...csvToArray(
            emailInfo.copyToIS &&
              !emailInfo.sendToIS &&
              process.env.DOOT_IS_RECIPIENT,
          ),
          ...csvToArray(
            emailInfo.copyToRS &&
              !emailInfo.sendToRS &&
              process.env.DOOT_RS_RECIPIENT,
          ),
        ];
      },

      getSummaryText: (emailData) => emailData.message,
      getTestFileName: (message) =>
        `./mail-test-${message?.numericData || 0}.html`,
    },
    recent,
  );
