/**
 * Builds email content for a DOOT email type.
 *
 * @param {Object} jsonData DOOT email data.
 * @param {string} jsonData.emailType Email event type.
 * @param {boolean} [jsonData.isReminder=false] Whether this is a reminder.
 * @returns {{
 *   subject: string,
 *   title: string,
 *   descriptionTemplate: string,
 *   buttonText: string
 * }} Email content and EJS description template.
 * @throws {Error} If the email type is unsupported.
 */
const getEmailContentByType = function (jsonData) {
  const actionText = jsonData.isReminder ? "Reminder: " : "Action required";

  // doot-contributor role saves a draft.
  if (jsonData.emailType === "draft-review") {
    return {
      subject: `${actionText}: Review and submit new dates`,
      title: "New dates or gate information to review",
      descriptionTemplate:
        "New dates or gate information has been saved by " +
        "<%= parkOperatorName %> to <%= parkSeasonEditTarget %>." +
        "<br><br>" +
        "Please review the changes and, if approved, submit them to HQ.",
      buttonText: "Review changes",
    };
  }

  // doot-submitter role submits dates to HQ for approval.
  if (jsonData.emailType === "hq-approval") {
    return {
      subject: `${actionText}: Approve new dates`,
      title: "New dates or gate information submitted",
      descriptionTemplate:
        "New dates or gate information has been submitted by " +
        "<%= parkOperatorName %> to <%= parkSeasonEditTarget %>." +
        "<br><br>" +
        "Please review the information for approval.",
      buttonText: "Review changes",
    };
  }

  // HQ rejects the dates and requests changes.
  if (jsonData.emailType === "approval-rejected") {
    return {
      subject: `${actionText}: Date update request`,
      title: "New dates requested",
      descriptionTemplate:
        "HQ has reviewed your dates for <%= parkSeasonEditTarget %>. " +
        "<br><br>" +
        "Please review the comment and re-submit to HQ.",
      buttonText: "Update dates",
    };
  }

  throw new Error(`Unsupported DOOT email type: ${jsonData.emailType}`);
};

/**
 * Builds a human-readable label identifying the season edit target.
 *
 * @param {Object} emailInfo DOOT email data.
 * @param {string} [emailInfo.parkName] Park name.
 * @param {string} [emailInfo.parkAreaName] Park area name.
 * @param {string} [emailInfo.featureName] Feature name.
 * @param {string} [emailInfo.seasonType] Season type.
 * @returns {string} Park and season edit-target label.
 */
const getEditTargetLabel = function (emailInfo) {
  const park = emailInfo.parkName || "";

  if (emailInfo.parkAreaName) {
    return `${park} (${emailInfo.parkAreaName})`;
  }

  if (emailInfo.featureName) {
    return `${park} (${emailInfo.featureName})`;
  }

  if (emailInfo.seasonType === "regular") {
    return `${park} (Tiers and gate)`;
  }

  if (emailInfo.seasonType === "winter") {
    return `${park} (Winter fee)`;
  }

  return park;
};

module.exports = {
  getEmailContentByType,
  getEditTargetLabel,
};
