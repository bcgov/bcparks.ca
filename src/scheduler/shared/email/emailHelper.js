const path = require("node:path");
const _ = require("lodash");

/**
 * Splits a comma-separated string into a trimmed array of non-empty values.
 *
 * @param {string} csv Comma-separated values.
 * @returns {string[]} Trimmed, non-empty values.
 */
const csvToArray = (csv) => _.compact(_.map(_.split(csv || "", ","), _.trim));

/**
 * Filters recipients against the configured non-production whitelist.
 *
 * In production, all recipients are returned. In other environments,
 * only recipients listed in EMAIL_RECIPIENT_WHITELIST are returned.
 *
 * @param {string[]} recipients Email addresses to filter.
 * @param {{error: Function, warn: Function}} logger Logger instance.
 * @param {string} logLabel Description used in log messages.
 * @param {boolean} [isCC=false] Whether the recipients are CC recipients.
 * @returns {string[]} Recipients permitted for the current environment.
 */
const filterRecipientsByEnvironment = function (
  recipients,
  logger,
  logLabel,
  isCC = false,
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

  if (!whitelist.length && !isCC) {
    logger.error(
      `Skipping ${logLabel} because EMAIL_RECIPIENT_WHITELIST is empty.`,
    );
    return [];
  }

  const whitelistSet = new Set(whitelist);

  // Compare plus-addressed recipients using their base address,
  // while returning the original address so the tag remains visible.
  const normalizeForWhitelist = (recipient) =>
    recipient.replace(/\+[^@]+@/, "@").toLowerCase();

  const filteredRecipients = recipients.filter((recipient) =>
    whitelistSet.has(normalizeForWhitelist(recipient)),
  );

  recipients
    .filter((recipient) => !whitelistSet.has(normalizeForWhitelist(recipient)))
    .forEach((recipient) => {
      logger.warn(
        `Non-prod ${isCC ? "cc " : ""}recipient filtered out: ${recipient}`,
      );
    });

  if (!filteredRecipients.length && !isCC) {
    logger.error(
      `Skipping ${logLabel} because no recipients matched ` +
        "EMAIL_RECIPIENT_WHITELIST.",
    );
  }

  return filteredRecipients;
};

/**
 * Returns the Parks logo as an inline email attachment.
 *
 * @returns {{filename: string, path: string, cid: string, contentDisposition: string}[]} Logo attachment configuration.
 */
const getLogoAttachment = function () {
  return [
    {
      filename: "logo-light.png",
      path: path.join(__dirname, "images", "logo-light.png"),
      cid: "logo-light.png",
      contentDisposition: "inline",
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

/**
 * Makes an email's HTML viewable as a local preview file. Inline images
 * referenced by cid (only resolved when the email is sent with attachments)
 * are pointed at the image files on disk instead.
 *
 * @param {string} html Rendered email HTML.
 * @returns {string} HTML for a preview file in the scheduler folder.
 */
const getPreviewHtml = function (html) {
  return _.replace(
    html,
    /cid:logo-light\.png/g,
    "./shared/email/images/logo-light.png",
  );
};

module.exports = {
  csvToArray,
  filterRecipientsByEnvironment,
  getLogoAttachment,
  getPreviewHtml,
  getSenderName,
};
