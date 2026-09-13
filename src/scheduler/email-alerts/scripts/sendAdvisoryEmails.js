const { processEmailQueue } = require("../utils/processEmailQueue");
const { buildEmailMetadata } = require("../utils/advisoryEmailMetadata");
const {
  getAdvisoryInfo,
  getAdvisoryDateInfo,
} = require("../utils/advisoryMailHelper");

exports.sendAdvisoryEmails = (recent) =>
  processEmailQueue(
    {
      action: "email advisory",
      templatePath: "./email-alerts/templates/public-advisory.ejs",
      label: "advisory",

      getDedupeKey: (message) =>
        `${message?.numericData}::${message?.jsonData?.subject || ""}`,

      buildEmailData: async (message) => {
        const emailInfo = message?.jsonData;
        const advisory = (await getAdvisoryInfo(message?.numericData))[0];
        const metadata = buildEmailMetadata(
          advisory,
          emailInfo?.metadataFields,
        );
        const { dateLabel, dateString } = getAdvisoryDateInfo(advisory);

        advisory.recreationResources = (advisory.recreationResources ?? []).map(
          (resource) => ({
            ...resource,
            link:
              resource.isDisplayed && resource.recResourceId
                ? `https://www.sitesandtrailsbc.ca/resource/${encodeURIComponent(resource.recResourceId)}`
                : null,
          }),
        );

        return {
          ...emailInfo,
          data: advisory,
          metadata,
          dateLabel,
          dateString,
          publicUrl: process.env.PUBLIC_URL,
          adminUrl: process.env.ADMIN_URL,
        };
      },

      getRecipients: (message) => [
        ...(process.env.EMAIL_RECIPIENT || "").split(","),
        ...(message?.jsonData?.additionalRecipients ?? []),
      ],

      getSummaryText: (emailData) => emailData.data.description,
      getTestFileName: (message) => `./mail-test-${message?.numericData}.html`,
    },
    recent,
  );
