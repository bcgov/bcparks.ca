/**
 * Filters recipients against the configured non-production whitelist.
 *
 * In production, all recipients are returned. In other environments,
 * only recipients listed in EMAIL_RECIPIENT_WHITELIST are returned.
 *
 * @param {string[]} recipients Email addresses to filter.
 * @param {{error: Function, warn: Function}} logger Logger instance.
 * @param {string} emailDescription Description used in log messages.
 * @returns {string[]} Recipients permitted for the current environment.
 */
const filterRecipientsByEnvironment = function (
  recipients,
  logger,
  emailDescription,
) {
  const environment = (
    process.env.BCPARKS_ENVIRONMENT || "local"
  ).toLowerCase();

  if (environment === "prod") {
    return recipients;
  }

  const whitelist = (process.env.EMAIL_RECIPIENT_WHITELIST || "")
    .split(",")
    .map((recipient) => recipient.trim().toLowerCase())
    .filter(Boolean);

  if (!whitelist.length) {
    logger.error(
      `Skipping ${emailDescription} because EMAIL_RECIPIENT_WHITELIST is empty.`,
    );
    return [];
  }

  const whitelistSet = new Set(whitelist);

  const filteredRecipients = recipients.filter((recipient) =>
    whitelistSet.has(recipient.toLowerCase()),
  );

  recipients
    .filter((recipient) => !whitelistSet.has(recipient.toLowerCase()))
    .forEach((recipient) => {
      logger.warn(`Non-prod recipient filtered out: ${recipient}`);
    });

  if (!filteredRecipients.length) {
    logger.error(
      `Skipping ${emailDescription} because no recipients matched ` +
        "EMAIL_RECIPIENT_WHITELIST.",
    );
  }

  return filteredRecipients;
};

/**
 * Returns the Parks logo as an email attachment.
 *
 * @returns {{path: string, cid: string}[]} Logo attachment configuration.
 */
const getLogoAttachment = function () {
  return [
    {
      path: "./email-alerts/images/logo.png",
      cid: "logo.png",
    },
  ];
};

/**
 * Returns the email sender name for the current environment.
 *
 * @returns {string} "Staff Web Portal" in production, otherwise the
 *   uppercased environment name.
 */
const getSenderName = function () {
  const environment = (
    process.env.BCPARKS_ENVIRONMENT || "local"
  ).toLowerCase();

  return environment === "prod"
    ? "Staff Web Portal"
    : environment.toUpperCase();
};

module.exports = {
  filterRecipientsByEnvironment,
  getLogoAttachment,
  getSenderName,
};
