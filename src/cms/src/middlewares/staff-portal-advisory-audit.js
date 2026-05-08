/**
 *  STAFF PORTAL ADVISORY AUDIT (Document Services Middleware)
 *  Provides advisory version history, publishing logic, and notifications using
 *  a custom dual‑collection model
 */

const { queueAdvisoryEmail } = require("../helpers/taskQueue.js");

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
   * Applies revisioning rules before update: Creates a new revision instead of changing published data.
   */
  async function beforeUpdate(ctx) {
    let { data, documentId } = ctx.params;

    documentId = documentId || data?.documentId;
    if (!documentId) return;

    const newPublicAdvisory = data;
    if (!newPublicAdvisory.publishedAt) return;

    // Get the status to save in the DB based on the publish intent (dates + requested status)
    const resolvedAdvisoryStatus =
      await resolvePublishIntentStatus(newPublicAdvisory);
    if (resolvedAdvisoryStatus) {
      newPublicAdvisory.advisoryStatus = resolvedAdvisoryStatus;
    }

    newPublicAdvisory.publishedAt = new Date();
    newPublicAdvisory.isLatestRevision = true;
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
      newPublicAdvisory.advisoryStatus,
    );

    // Keep the currently published revision unchanged when creating a draft or review revision.
    if (
      oldAdvisoryStatus === "PUB" &&
      ["DFT", "HQR"].includes(newAdvisoryStatusCode)
    ) {
      // Create a successor revision instead of mutating the currently published revision.
      const nextRevisionNumber = await getNextRevisionNumber(
        oldPublicAdvisory.advisoryNumber,
      );

      // Strip Strapi metadata fields out of the data for the new revision
      const {
        id,
        documentId,
        createdBy,
        updatedBy,
        createdAt,
        updatedAt,
        // Keep the data explicitly sent from the frontend
        ...successorBase
      } = newPublicAdvisory;

      const successor = {
        ...successorBase,
        advisoryNumber: oldPublicAdvisory.advisoryNumber,
        revisionNumber: nextRevisionNumber,
        isLatestRevision: true,
      };

      await markAsNotLatestRevision(oldPublicAdvisory.id);
      const createdRevision = await strapi
        .documents("api::public-advisory-audit.public-advisory-audit")
        .create({ data: successor });

      if (!ctx.state) {
        ctx.state = {};
      }
      ctx.state.skipUpdateLifecycle = true;
      ctx.result = createdRevision;
      return;
    }

    if (isAdvisoryEqual(newPublicAdvisory, oldPublicAdvisory)) return;

    // flow 5: system updates
    if (newPublicAdvisory.modifiedBy === "system") {
      await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
      newPublicAdvisory.revisionNumber = await getNextRevisionNumber(
        oldPublicAdvisory.advisoryNumber,
      );
      return;
    }

    // flow 4: update unpublished (set by system)
    if (
      oldAdvisoryStatus === "UNP" &&
      oldPublicAdvisory.modifiedBy === "system"
    ) {
      await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
      newPublicAdvisory.revisionNumber = await getNextRevisionNumber(
        oldPublicAdvisory.advisoryNumber,
      );
      return;
    }

    // flow 3: update published advisory
    if (oldAdvisoryStatus === "PUB") {
      await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
      newPublicAdvisory.revisionNumber = await getNextRevisionNumber(
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

      // When `beforeUpdate` already created the successor revision, skip the update call.
      if (context.state?.skipUpdateLifecycle) {
        return context.result;
      }

      context.result = await next();
      await afterUpdate(context);
      return context.result;
    }

    return await next();
  };
};

// HELPER FUNCTIONS

async function getNextAdvisoryNumber() {
  const results = await strapi
    .documents("api::public-advisory-audit.public-advisory-audit")
    .findMany({
      sort: { advisoryNumber: "DESC" },
      limit: 1,
      fields: ["advisoryNumber"],
    });
  let maxAdvisoryNumber = results.length > 0 ? results[0].advisoryNumber : 0;
  if (!maxAdvisoryNumber || maxAdvisoryNumber < 0) maxAdvisoryNumber = 0;
  return ++maxAdvisoryNumber;
}

async function getNextRevisionNumber(advisoryNumber) {
  const results = await strapi
    .documents("api::public-advisory-audit.public-advisory-audit")
    .findMany({
      filters: {
        advisoryNumber,
      },
      sort: { revisionNumber: "DESC" },
      limit: 1,
      fields: ["revisionNumber"],
    });
  let maxRevisionNumber = results.length > 0 ? results[0].revisionNumber : 0;
  if (!maxRevisionNumber || maxRevisionNumber < 0) maxRevisionNumber = 0;
  return ++maxRevisionNumber;
}

/**
 * Demotes one advisory-audit record so a successor can become the latest revision.
 */
async function markAsNotLatestRevision(id) {
  await strapi.db
    .query("api::public-advisory-audit.public-advisory-audit")
    .update({
      where: { id },
      data: { isLatestRevision: false },
    });
}

/**
 * Resolves publish intent into the advisoryStatus payload value to save in the DB.
 * Returns null when no status rewrite is needed.
 */
async function resolvePublishIntentStatus(data) {
  // Only resolve statuses when the request is trying to publish.
  const requestedStatusCode = await getAdvisoryStatusCode(data?.advisoryStatus);
  if (requestedStatusCode !== "PUB") {
    return null;
  }

  // Apply date-based publishing rules: UNP (expired) > SCH (future) > PUB (active now).
  const resolvedCode = resolvePublishStatusCode(data);
  if (resolvedCode === requestedStatusCode) {
    return null;
  }

  const resolvedStatus = await getAdvisoryStatusByCode(resolvedCode);
  if (!resolvedStatus) {
    return null;
  }

  return typeof data.advisoryStatus === "object" && data.advisoryStatus !== null
    ? { id: resolvedStatus.id }
    : resolvedStatus.documentId;
}

/**
 * Resolves publish target code based on expiry and posting dates.
 */
function resolvePublishStatusCode(data) {
  const now = new Date();
  const expiryDate = data?.expiryDate ? new Date(data.expiryDate) : null;
  const advisoryDate = data?.advisoryDate ? new Date(data.advisoryDate) : null;

  // If the expiry date is now or in the past, use "Unpublished" status
  if (expiryDate && !Number.isNaN(expiryDate.getTime()) && expiryDate <= now) {
    return "UNP";
  }

  // If the posting date is in the future, use "Scheduled" status
  if (
    advisoryDate &&
    !Number.isNaN(advisoryDate.getTime()) &&
    advisoryDate > now
  ) {
    return "SCH";
  }

  // Default: advisory is active now, so use "Published" status
  return "PUB";
}

/**
 * Reads advisory status code from supported relation payload shapes.
 */
async function getAdvisoryStatusCode(statusValue) {
  // Accept relation values in different shapes (object with code/id/documentId, or documentId string).
  if (!statusValue) return null;

  if (typeof statusValue === "object" && statusValue !== null) {
    // If statusValue already has the code, return it directly
    if (statusValue.code) {
      return statusValue.code;
    }

    // Look up the code based on the provided id or documentId
    if (statusValue.documentId) {
      const status = await strapi
        .documents("api::advisory-status.advisory-status")
        .findOne({
          documentId: statusValue.documentId,
          fields: ["code"],
        });
      return status?.code ?? null;
    }

    if (statusValue.id) {
      const status = await strapi
        .documents("api::advisory-status.advisory-status")
        .findFirst({
          filters: { id: statusValue.id },
          fields: ["code"],
        });
      return status?.code ?? null;
    }
  }

  // If it's a string, treat it as a documentId and look up the code
  if (typeof statusValue === "string") {
    const status = await strapi
      .documents("api::advisory-status.advisory-status")
      .findOne({
        documentId: statusValue,
        fields: ["code"],
      });
    return status?.code ?? null;
  }

  return null;
}

/**
 * Looks up advisory-status metadata by code.
 */
async function getAdvisoryStatusByCode(code) {
  // Resolve status metadata once we know the target code.
  return await strapi
    .documents("api::advisory-status.advisory-status")
    .findFirst({
      filters: { code },
      fields: ["id", "documentId", "code"],
    });
}

async function archiveOldPublicAdvisoryAudit(data) {
  delete data.id;
  delete data.documentId;
  delete data.updatedBy;
  delete data.createdBy;
  delete data.links; // keep links connected to the latest revision, not the archived version
  data.publishedAt = null;
  data.isLatestRevision = false;

  try {
    await strapi
      .documents("api::public-advisory-audit.public-advisory-audit")
      .create({ data: data });
  } catch (error) {
    strapi.log.error(
      `error creating public-advisory-audit ${data.advisoryNumber}...`,
      error,
    );
  }
}

async function savePublicAdvisory(publicAdvisory) {
  delete publicAdvisory.updatedBy;
  delete publicAdvisory.createdBy;
  const isExist = await strapi
    .documents("api::public-advisory.public-advisory")
    .findFirst({
      filters: {
        advisoryNumber: publicAdvisory.advisoryNumber,
      },
      fields: ["advisoryNumber"],
    });
  if (publicAdvisory.advisoryStatus.code === "PUB") {
    publicAdvisory.publishedAt = new Date();
    if (isExist) {
      try {
        publicAdvisory.id = isExist.id;
        publicAdvisory.documentId = isExist.documentId;
        strapi.log.info(
          `updating public-advisory advisoryNumber ${publicAdvisory.advisoryNumber}...`,
        );
        await strapi.documents("api::public-advisory.public-advisory").update({
          documentId: isExist.documentId,
          data: publicAdvisory,
        });
      } catch (error) {
        strapi.log.error(
          `error updating public-advisory advisoryNumber ${publicAdvisory.advisoryNumber}...`,
          error,
        );
      }
    } else {
      try {
        delete publicAdvisory.id;
        delete publicAdvisory.documentId;
        strapi.log.info(
          `creating public-advisory advisoryNumber ${publicAdvisory.advisoryNumber}...`,
        );
        await strapi.documents("api::public-advisory.public-advisory").create({
          data: publicAdvisory,
        });
      } catch (error) {
        strapi.log.error(
          `error creating public-advisory ${publicAdvisory.id}...`,
          error,
        );
      }
    }
  } else if (isExist) {
    try {
      strapi.log.info(
        `deleting public-advisory advisoryNumber ${publicAdvisory.advisoryNumber}...`,
      );
      await strapi
        .documents("api::public-advisory.public-advisory")
        .delete({ documentId: isExist.documentId });
    } catch (error) {
      strapi.log.error(
        `error deleting public-advisory ${publicAdvisory.id}...`,
        error,
      );
    }
  }
}

async function copyToPublicAdvisory(newPublicAdvisory) {
  if (newPublicAdvisory.isLatestRevision && newPublicAdvisory.advisoryStatus) {
    const triggerStatuses = ["PUB", "UNP"];
    if (triggerStatuses.includes(newPublicAdvisory.advisoryStatus.code)) {
      await savePublicAdvisory(newPublicAdvisory);
    }
  }
}

function isAdvisoryEqual(newData, oldData) {
  const fieldsToCompare = {
    title: null,
    description: null,
    isSafetyRelated: null,
    listingRank: null,
    note: null,
    advisoryDate: null,
    effectiveDate: null,
    endDate: null,
    expiryDate: null,
    accessStatus: {},
    eventType: {},
    urgency: {},
    standardMessages: [],
    protectedAreas: [],
    advisoryStatus: {},
    links: [],
    regions: [],
    sections: [],
    managementAreas: [],
    sites: [],
    fireCentres: [],
    fireZones: [],
    naturalResourceDistricts: [],
    isAdvisoryDateDisplayed: null,
    isEffectiveDateDisplayed: null,
    isEndDateDisplayed: null,
    isUpdatedDateDisplayed: null,
    modifiedBy: null,
  };

  for (const key of Object.keys(fieldsToCompare)) {
    if (Array.isArray(oldData[key])) {
      oldData[key] = oldData[key].map((x) => x.id).sort();
      if (newData[key]) newData[key].sort();
    } else {
      if (typeof oldData[key] === "object" && oldData[key])
        oldData[key] = oldData[key].id;
    }
    if (JSON.stringify(newData[key]) != JSON.stringify(oldData[key]))
      return false;
  }
  return true;
}
