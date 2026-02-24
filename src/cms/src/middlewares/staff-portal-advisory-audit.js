/**
 *  STAFF PORTAL ADVISORY AUDIT (Document Services Middleware)
 *  Provides advisory version history, publishing logic, and notifications using
 *  a custom dual‑collection model
 */

const { queueAdvisoryEmail } = require("../helpers/taskQueue.js");

module.exports = (strapi) => {
  async function beforeCreate(ctx) {
    let { data } = ctx.params;
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

    if (newAdvisoryStatus === "ARQ") {
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

  async function beforeUpdate(ctx) {
    let { data, documentId } = ctx.params;

    documentId = documentId || data?.documentId;
    if (!documentId) return;

    const newPublicAdvisory = data;
    if (!newPublicAdvisory.publishedAt) return;

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

    if (isAdvisoryEqual(newPublicAdvisory, oldPublicAdvisory)) return;

    // flow 5: system updates
    if (newPublicAdvisory.modifiedBy === "system") {
      await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
      newPublicAdvisory.revisionNumber = await getNextRevisionNumber(
        oldPublicAdvisory.advisoryNumber,
      );
      return;
    }

    // flow 4: update inactive (set by system)
    if (
      oldAdvisoryStatus === "INA" &&
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

  async function afterUpdate(ctx) {
    const publicAdvisoryAudit = await strapi
      .documents("api::public-advisory-audit.public-advisory-audit")
      .findOne({
        documentId: ctx.result.documentId,
        populate: "*",
      });

    const oldAdvisoryStatus = ctx.state.oldStatus; // saved by beforeUpdate() above
    const newAdvisoryStatus = publicAdvisoryAudit.advisoryStatus?.code;

    if (newAdvisoryStatus === "ARQ" && oldAdvisoryStatus !== "ARQ") {
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
    const triggerStatuses = ["PUB", "INA"];
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
