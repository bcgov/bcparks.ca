/**
 *  STAFF PORTAL ADVISORY AUDIT (Document Services Middleware)
 *  Provides advisory version history, publishing logic, and notifications using
 *  a custom dual‑collection model
 */

const { queueAdvisoryEmail } = require("../helpers/taskQueue.js");
const { getNextAdvisoryNumber } = require("./helpers/advisoryNumbers.js");
const {
  resolvePublishIntentStatus,
  getAdvisoryStatusCode,
} = require("./helpers/advisoryStatus.js");
const {
  archiveOldPublicAdvisoryAudit,
  syncProjections,
  queueRecSpaceDelete,
  isAdvisoryEqual,
} = require("./helpers/advisoryData.js");
const { METADATA_FIELDS } = require("../helpers/advisoryEmailMetadata.js");

module.exports = () => {
  /**
   * Prepares create payload defaults and resolves publish intent status from dates.
   */
  async function beforeCreate(ctx) {
    let { data } = ctx.params;

    // Get the status to save in the DB based on the publish intent (dates + requested status)
    const resolvedAdvisoryStatus = await resolvePublishIntentStatus(data);
    if (resolvedAdvisoryStatus) {
      data.advisoryStatus = resolvedAdvisoryStatus;
    }

    if (!data.revisionNumber && !data.advisoryNumber) {
      data.advisoryNumber = await getNextAdvisoryNumber();
      data.revisionNumber = 1;
      data.isLatestRevision = true;
    }
  }

  async function afterCreate(ctx) {
    const newPublicAdvisoryAudit = await strapi
      .documents("api::public-advisory-audit.public-advisory-audit")
      .findOne({
        documentId: ctx.result.documentId,
        populate: "*",
      });

    const newAdvisoryStatus = newPublicAdvisoryAudit.advisoryStatus?.code;

    const urgency =
      newPublicAdvisoryAudit.urgency?.urgency?.toLowerCase() ?? "";

    if (newAdvisoryStatus === "HQR") {
      await queueAdvisoryEmail(
        `Review draft: ${urgency} urgency advisory / closure`,
        "A draft advisory / closure is ready for review:",
        newPublicAdvisoryAudit.advisoryNumber,
        "staff-portal-advisory-audit::afterCreate()",
        [],
        [METADATA_FIELDS.POSTING_DATE, METADATA_FIELDS.SUBMITTER],
      );
    }

    if (
      newAdvisoryStatus === "PUB" &&
      newPublicAdvisoryAudit.isUrgentAfterHours
    ) {
      // After-hours posting notification
      // If users with after-hours posting permission posted this with an urgent/after-hours flag
      await queueAdvisoryEmail(
        "After-hours advisory / closure was posted",
        "An after-hours advisory / closure was posted:",
        newPublicAdvisoryAudit.advisoryNumber,
        "staff-portal-advisory-audit::afterCreate()",
        [],
        [METADATA_FIELDS.POSTING_DATE],
      );
    } else if (
      (newAdvisoryStatus === "SCH" || newAdvisoryStatus === "PUB") &&
      // Don't send a notification if the advisory was posted by HQ Staff (approver role)
      // because they are the ones who will be reviewing it.
      newPublicAdvisoryAudit.modifiedByRole !== "approver"
    ) {
      // Regular posting notification:
      // If the advisory is created directly with status SCH or PUB
      await queueAdvisoryEmail(
        `Review posting: ${urgency} urgency advisory / closure`,
        "An advisory / closure is ready for review:",
        newPublicAdvisoryAudit.advisoryNumber,
        "staff-portal-advisory-audit::afterCreate()",
        [],
        [METADATA_FIELDS.POSTING_DATE, METADATA_FIELDS.SUBMITTER],
      );
    }

    await syncProjections(newPublicAdvisoryAudit, null);
  }

  /**
   * Applies revisioning rules before update: create an archived copy of the current live record,
   * and continue the update on that live record with the next revision number.
   */
  async function beforeUpdate(ctx) {
    let { data, documentId } = ctx.params;

    documentId = documentId || data?.documentId;
    if (!documentId) return;

    // This variable represents the advisory being updated (not a new one)
    const updatedPublicAdvisory = data;

    // Get the status to save in the DB based on the publish intent (dates + requested status)
    const resolvedAdvisoryStatus = await resolvePublishIntentStatus(
      updatedPublicAdvisory,
    );
    if (resolvedAdvisoryStatus) {
      updatedPublicAdvisory.advisoryStatus = resolvedAdvisoryStatus;
    }

    // Updated features will always be the latest revision, so set the flag true if it's not already.
    updatedPublicAdvisory.isLatestRevision = true;

    const oldPublicAdvisory = await strapi
      .documents("api::public-advisory-audit.public-advisory-audit")
      .findOne({
        documentId,
        populate: "*",
      });

    if (!oldPublicAdvisory) return;

    const oldAdvisoryStatus = oldPublicAdvisory.advisoryStatus
      ? oldPublicAdvisory.advisoryStatus.code
      : "DFT";

    // Get the new status code for the revisioning checks below.
    const newAdvisoryStatusCode = await getAdvisoryStatusCode(
      updatedPublicAdvisory.advisoryStatus,
    );

    // save the status of the old advisory so we can get it back in afterUpdate()
    if (!ctx.state) {
      ctx.state = {};
    }
    ctx.state.oldStatus = oldAdvisoryStatus;

    // Copy unpublish metadata to the previous revision because it is the version
    // actually being unpublished; the audit fields become immutable on the previous version.
    if (newAdvisoryStatusCode === "UNP" && oldAdvisoryStatus === "PUB") {
      oldPublicAdvisory.unpublishedByName =
        updatedPublicAdvisory.unpublishedByName;
      oldPublicAdvisory.unpublishedDate = updatedPublicAdvisory.unpublishedDate;
    }

    if (isAdvisoryEqual(updatedPublicAdvisory, oldPublicAdvisory)) return;

    if (
      updatedPublicAdvisory.reviewedByName &&
      !updatedPublicAdvisory.modifiedByName &&
      !updatedPublicAdvisory.publishedByName &&
      !updatedPublicAdvisory.unpublishedByName
    ) {
      // Review-only updates: no new revision needed.
      // The review payload is sent via PUT with minimal data
      return;
    }

    // revision flow 1: changes to published advisories
    if (oldAdvisoryStatus === "PUB") {
      await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
      updatedPublicAdvisory.revisionNumber =
        oldPublicAdvisory.revisionNumber + 1;
      return;
    }

    // revision flow 2: non-published advisory modified by a different user
    if (
      oldPublicAdvisory.modifiedByName !==
        updatedPublicAdvisory.modifiedByName &&
      ["DFT", "HQR", "SCH"].includes(newAdvisoryStatusCode) &&
      ["DFT", "HQR", "SCH"].includes(oldAdvisoryStatus)
    ) {
      await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
      updatedPublicAdvisory.revisionNumber =
        oldPublicAdvisory.revisionNumber + 1;
      return;
    }
  }

  /**
   * Handles notification and public collection synchronization after update.
   */
  async function afterUpdate(ctx) {
    if (!ctx?.result?.documentId) return;

    const newPublicAdvisoryAudit = await strapi
      .documents("api::public-advisory-audit.public-advisory-audit")
      .findOne({
        documentId: ctx.result.documentId,
        populate: "*",
      });

    const oldPublicAdvisory = await strapi
      .documents("api::public-advisory-audit.public-advisory-audit")
      .findFirst({
        filters: {
          advisoryNumber: newPublicAdvisoryAudit.advisoryNumber,
          revisionNumber: newPublicAdvisoryAudit.revisionNumber - 1,
        },
        populate: "*",
      });

    const oldAdvisoryStatus = ctx.state?.oldStatus; // saved by beforeUpdate() above
    const newAdvisoryStatus = newPublicAdvisoryAudit.advisoryStatus?.code;

    const urgency =
      newPublicAdvisoryAudit.urgency?.urgency?.toLowerCase() ?? "";

    if (newAdvisoryStatus === "HQR" && oldAdvisoryStatus !== "HQR") {
      await queueAdvisoryEmail(
        `Review draft: ${urgency} urgency advisory / closure`,
        "A draft advisory / closure is ready for review:",
        newPublicAdvisoryAudit.advisoryNumber,
        "staff-portal-advisory-audit::afterUpdate()",
        [],
        [METADATA_FIELDS.POSTING_DATE, METADATA_FIELDS.SUBMITTER],
      );
    }

    if (
      newAdvisoryStatus === "PUB" &&
      oldAdvisoryStatus !== "PUB" &&
      (newPublicAdvisoryAudit.modifiedByRole === "submitter" ||
        newPublicAdvisoryAudit.modifiedByRole === "contributor") &&
      newPublicAdvisoryAudit.isUrgentAfterHours
    ) {
      // After-hours posting notification
      // If users with after-hours posting permission posted this with an urgent/after-hours flag
      await queueAdvisoryEmail(
        "After-hours advisory / closure was posted",
        "An after-hours advisory / closure was posted:",
        newPublicAdvisoryAudit.advisoryNumber,
        "staff-portal-advisory-audit::afterUpdate()",
        [],
        [METADATA_FIELDS.POSTING_DATE],
      );
    } else if (
      ((newAdvisoryStatus === "SCH" && oldAdvisoryStatus !== "SCH") ||
        (newAdvisoryStatus === "PUB" && oldAdvisoryStatus !== "PUB")) &&
      // Don't send a notification if the advisory was posted by HQ Staff (approver role)
      // because they are the ones who will be reviewing it.
      newPublicAdvisoryAudit.modifiedByRole !== "approver"
    ) {
      // Regular posting notification:
      // If the status changed from some other status to SCH or PUB
      await queueAdvisoryEmail(
        `Review posting: ${urgency} urgency advisory / closure`,
        "An advisory / closure is ready for review:",
        newPublicAdvisoryAudit.advisoryNumber,
        "staff-portal-advisory-audit::afterUpdate()",
        [],
        [METADATA_FIELDS.POSTING_DATE, METADATA_FIELDS.SUBMITTER],
      );
    }

    if (
      oldAdvisoryStatus === "SCH" &&
      !["SCH", "PUB"].includes(newAdvisoryStatus)
    ) {
      await queueRecSpaceDelete(
        newPublicAdvisoryAudit,
        "staff-portal-advisory-audit::afterUpdate()",
      );
    }

    await syncProjections(newPublicAdvisoryAudit, oldPublicAdvisory);
  }

  // Middleware entry point
  return async (context, next) => {
    if (
      context.uid !== "api::public-advisory-audit.public-advisory-audit" ||
      !["update", "create"].includes(context.action)
    ) {
      return await next();
    }

    strapi.log.info(
      `staffPortalAdvisoryAuditMiddleware ${context.uid}-${context.action}`,
    );

    /**
     * This structure mimics Strapi 4 lifecycle hooks, allowing legacy code reuse
     * in Strapi 5 middleware.
     * Keeping a similar layout preserves Git history and eases code reviews.
     * For the original pattern, see the earliest git commit of this file.
     */

    // replicate beforeCreate/afterCreate lifecycles in Strapi 4
    if (context.action === "create") {
      // skip if we are creating an audit record
      if (context.params?.data?.isLatestRevision === false) {
        return await next();
      }

      await beforeCreate(context);
      context.result = await next();
      await afterCreate(context);
      return context.result;
    }

    // replicate beforeUpdate/afterUpdate lifecycles in Strapi 4
    if (context.action === "update") {
      await beforeUpdate(context);

      context.result = await next();
      await afterUpdate(context);
      return context.result;
    }

    return await next();
  };
};
