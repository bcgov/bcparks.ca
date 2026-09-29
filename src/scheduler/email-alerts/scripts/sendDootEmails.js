const _ = require("lodash");
const { processEmailQueue } = require("../utils/processEmailQueue");

/**
 * Splits a comma-separated string into a trimmed array of non-empty values.
 * @param {string} csv comma-separated values
 * @returns {string[]} trimmed, non-empty values
 */
const csvToArray = (csv) => _.compact(_.map(_.split(csv || "", ","), _.trim));

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
        return emailInfo.ccIS && !emailInfo.sendToIS
          ? csvToArray(process.env.DOOT_IS_RECIPIENT)
          : [];
      },

      getSummaryText: (emailData) => emailData.message,
      getTestFileName: (message) =>
        `./mail-test-${message?.numericData || 0}.html`,
    },
    recent,
  );
