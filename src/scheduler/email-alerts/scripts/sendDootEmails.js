const { processEmailQueue } = require("../utils/processEmailQueue");

exports.sendDootEmails = (recent) =>
  processEmailQueue(
    {
      action: "email doot",
      templatePath: "./email-alerts/templates/doot-notification.ejs",
      label: "DOOT",

      getDedupeKey: (message) => message?.jsonData?.antiDuplicateKey || "",

      buildEmailData: async (message) => ({
        ...message?.jsonData,
        adminUrl: process.env.ADMIN_URL,
      }),

      getRecipients: (message) => {
        const csvToArray = (csv) =>
          (csv || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

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

      getSummaryText: (emailData) => emailData.message,
      getTestFileName: (message) =>
        `./mail-test-${message?.numericData || 0}.html`,
    },
    recent,
  );
