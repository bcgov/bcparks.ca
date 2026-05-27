/**
 *  STAFF PORTAL ADVISORY AUDIT (Document Services Middleware)
 *  Provides advisory version history, publishing logic, and notifications using
 *  a custom dual‑collection model
 */

const { queueAdvisoryEmail } = require("../helpers/taskQueue.js");
const {
  getNextAdvisoryNumber,
  getNextRevisionNumber,
} = require("./helpers/advisoryNumbers.js");
const {
  resolvePublishIntentStatus,
  getAdvisoryStatusCode,
} = require("./helpers/advisoryStatus.js");
const {
  archiveOldPublicAdvisoryAudit,
  copyToPublicAdvisory,
  isAdvisoryEqual,
} = require("./helpers/advisoryData.js");

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
      data.publishedAt = new Date();
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

    if (newAdvisoryStatus === "HQR") {
      await queueAdvisoryEmail(
        "Approval requested",
        "Approval requested for the following advisory",
        newPublicAdvisoryAudit.advisoryNumber,
        "public-advisory-audit::lifecycles::afterCreate()",
      );
    }

    if (
      newAdvisoryStatus === "PUB" &&
      newPublicAdvisoryAudit.isUrgentAfterHours
    ) {
      await queueAdvisoryEmail(
        "After-hours advisory posted",
        "An after-hours advisory was posted",
        newPublicAdvisoryAudit.advisoryNumber,
        "public-advisory-audit::lifecycles::afterCreate()",
      );
    }

    await copyToPublicAdvisory(newPublicAdvisoryAudit);
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
    if (!updatedPublicAdvisory.publishedAt) return;

    // Get the status to save in the DB based on the publish intent (dates + requested status)
    const resolvedAdvisoryStatus = await resolvePublishIntentStatus(
      updatedPublicAdvisory,
    );
    if (resolvedAdvisoryStatus) {
      updatedPublicAdvisory.advisoryStatus = resolvedAdvisoryStatus;
    }

    updatedPublicAdvisory.publishedAt = new Date();

    // Updated features will always be the latest revision, so set the flag true if it's not already.
    updatedPublicAdvisory.isLatestRevision = true;

    const oldPublicAdvisory = await strapi
      .documents("api::public-advisory-audit.public-advisory-audit")
      .findOne({
        documentId,
        populate: "*",
      });

    if (!oldPublicAdvisory) return;
    if (!oldPublicAdvisory.publishedAt) return;

    // save the status of the old advisory so we can get it back in afterUpdate()
    if (!ctx.state) {
      ctx.state = {};
    }
    ctx.state.oldStatus = oldPublicAdvisory.advisoryStatus?.code;

    const oldAdvisoryStatus = oldPublicAdvisory.advisoryStatus
      ? oldPublicAdvisory.advisoryStatus.code
      : "DFT";

    // Get the new status code for the revisioning checks below.
    const newAdvisoryStatusCode = await getAdvisoryStatusCode(
      updatedPublicAdvisory.advisoryStatus,
    );

    // When changing a published advisory into draft/review status, create an archived copy
    // of the current live revision first, then let the live record continue as the next revision.
    if (
      oldAdvisoryStatus === "PUB" &&
      ["DFT", "HQR"].includes(newAdvisoryStatusCode)
    ) {
      // Create an archived copy of the current live revision, and update
      // that live record with the next revision number.
      await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
      updatedPublicAdvisory.advisoryNumber = oldPublicAdvisory.advisoryNumber;
      updatedPublicAdvisory.revisionNumber = await getNextRevisionNumber(
        oldPublicAdvisory.advisoryNumber,
      );
      updatedPublicAdvisory.isLatestRevision = true;
      return;
    }

    if (isAdvisoryEqual(updatedPublicAdvisory, oldPublicAdvisory)) return;

    // flow 5: system updates
    if (updatedPublicAdvisory.modifiedByName === "system") {
      await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
      updatedPublicAdvisory.revisionNumber = await getNextRevisionNumber(
        oldPublicAdvisory.advisoryNumber,
      );
      return;
    }

    // flow 4: update unpublished (set by system)
    if (
      oldAdvisoryStatus === "UNP" &&
      oldPublicAdvisory.modifiedByName === "system"
    ) {
      await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
      updatedPublicAdvisory.revisionNumber = await getNextRevisionNumber(
        oldPublicAdvisory.advisoryNumber,
      );
      return;
    }

    // flow 3: update published advisory
    if (oldAdvisoryStatus === "PUB") {
      await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
      updatedPublicAdvisory.revisionNumber = await getNextRevisionNumber(
        oldPublicAdvisory.advisoryNumber,
      );
      return;
    }
  }

  /**
   * Handles notification and public collection synchronization after update.
   */
  async function afterUpdate(ctx) {
    if (!ctx?.result?.documentId) return;

    const publicAdvisoryAudit = await strapi
      .documents("api::public-advisory-audit.public-advisory-audit")
      .findOne({
        documentId: ctx.result.documentId,
        populate: "*",
      });

    const oldAdvisoryStatus = ctx.state?.oldStatus; // saved by beforeUpdate() above
    const newAdvisoryStatus = publicAdvisoryAudit.advisoryStatus?.code;

    if (newAdvisoryStatus === "HQR" && oldAdvisoryStatus !== "HQR") {
      await queueAdvisoryEmail(
        "Approval requested",
        "Approval requested for the following advisory",
        publicAdvisoryAudit.advisoryNumber,
        "public-advisory-audit::lifecycles::afterUpdate()",
      );
    }

    if (
      newAdvisoryStatus === "PUB" &&
      oldAdvisoryStatus !== "PUB" &&
      publicAdvisoryAudit.modifiedByRole === "submitter" &&
      publicAdvisoryAudit.isUrgentAfterHours
    ) {
      await queueAdvisoryEmail(
        "After-hours advisory posted",
        "An after-hours advisory was posted",
        publicAdvisoryAudit.advisoryNumber,
        "public-advisory-audit::lifecycles::afterUpdate()",
      );
    }

    await copyToPublicAdvisory(publicAdvisoryAudit);
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
