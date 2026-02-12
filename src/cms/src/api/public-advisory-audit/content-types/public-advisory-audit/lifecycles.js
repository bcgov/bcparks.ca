/*
 * ============================================================
 * STRAPI 5 LIFECYCLE HOOKS - MIGRATED TO DOCUMENT SERVICE
 * ============================================================
 *
 * NOTE: This lifecycle logic has been migrated to Document Service Middleware
 * in src/index.js as recommended by Strapi v5 migration guide.
 *
 * This file is kept for reference but the main logic now runs through the
 * centralized middleware to properly handle Draft & Publish and i18n features.
 *
 * Migration Guide: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service
 * Document Service Middlewares: https://docs.strapi.io/cms/api/document-service/middlewares
 *
 * ============================================================
 */

"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const { queueAdvisoryEmail } = require("../../../../helpers/taskQueue.js");
const disabled = process.env.DISABLE_LIFECYCLES === "true";

const getNextAdvisoryNumber = async () => {
  const results = await strapi.documents('api::public-advisory-audit.public-advisory-audit').findMany({
    sort: { advisoryNumber: 'DESC' },
    limit: 1,
    fields: ['advisoryNumber']
  });
  let maxAdvisoryNumber = results.length > 0 ? results[0].advisoryNumber : 0;
  if (!maxAdvisoryNumber || maxAdvisoryNumber < 0) maxAdvisoryNumber = 0;
  return ++maxAdvisoryNumber;
};

const getNextRevisionNumber = async (advisoryNumber) => {
  const results = await strapi.documents('api::public-advisory-audit.public-advisory-audit').findMany({
    filters: {
      advisoryNumber
    },
    sort: { revisionNumber: 'DESC' },
    limit: 1,
    fields: ['revisionNumber']
  });
  let maxRevisionNumber = results.length > 0 ? results[0].revisionNumber : 0;
  if (!maxRevisionNumber || maxRevisionNumber < 0) maxRevisionNumber = 0;
  return ++maxRevisionNumber;
};

const archiveOldPublicAdvisoryAudit = async (data) => {
  delete data.id;
  delete data.updatedBy;
  delete data.createdBy;
  delete data.links; // keep links connected to the latest revision, not the archived version
  data.publishedAt = null;
  data.isLatestRevision = false;

  try {
    await strapi.documents('api::public-advisory-audit.public-advisory-audit').create({ data: data })
  } catch (error) {
    strapi.log.error(
      `error creating public-advisory-audit ${data.advisoryNumber}...`,
      error
    );
  }
};

const savePublicAdvisory = async (publicAdvisory) => {
  delete publicAdvisory.updatedBy;
  delete publicAdvisory.createdBy;
  const isExist = await strapi.documents('api::public-advisory.public-advisory').findFirst({
    filters: {
      advisoryNumber: publicAdvisory.advisoryNumber
    },
    fields: ['id']
  });
  if (publicAdvisory.advisoryStatus.code === "PUB") {
    publicAdvisory.publishedAt = new Date();
    if (isExist) {
      try {
        publicAdvisory.id = isExist.id;
        await strapi.documents('api::public-advisory.public-advisory').update({
          documentId: isExist.documentId, data: publicAdvisory
        })
      } catch (error) {
        strapi.log.error(
          `error updating public-advisory advisoryNumber ${publicAdvisory.advisoryNumber}...`,
          error
        );
      }
    } else {
      try {
        delete publicAdvisory.id;
        await strapi.documents('api::public-advisory.public-advisory').create({
          data: publicAdvisory
        });
      } catch (error) {
        strapi.log.error(
          `error creating public-advisory ${publicAdvisory.id}...`,
          error
        );
      }
    }
  } else if (isExist) {
    try {
      await strapi.documents('api::public-advisory.public-advisory').delete({ documentId: isExist.documentId });
    } catch (error) {
      strapi.log.error(
        `error deleting public-advisory ${publicAdvisory.id}...`,
        error
      );
    }
  }
};

const copyToPublicAdvisory = async (newPublicAdvisory) => {
  if (newPublicAdvisory.isLatestRevision && newPublicAdvisory.advisoryStatus) {
    const publishedStatuses = ["PUB", "INA"];
    if (publishedStatuses.includes(newPublicAdvisory.advisoryStatus.code)) {
      savePublicAdvisory(newPublicAdvisory);
    }
  }
};

const isAdvisoryEqual = (newData, oldData) => {
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
};

module.exports = {
  beforeCreate: async (ctx) => {
    if (disabled) return;
    let { data } = ctx.params;
    if (!data.revisionNumber && !data.advisoryNumber) {
      data.advisoryNumber = await getNextAdvisoryNumber();
      data.revisionNumber = 1;
      data.isLatestRevision = true;
      data.publishedAt = new Date();
    }
  },
  afterCreate: async (ctx) => {
    if (disabled) return;
    const newPublicAdvisoryAudit = await strapi.documents('api::public-advisory-audit.public-advisory-audit').findOne({
      documentId: ctx.result.documentId,
      populate: "*"
    });

    const newAdvisoryStatus = newPublicAdvisoryAudit.advisoryStatus?.code;

    if (newAdvisoryStatus === "ARQ") {
      await queueAdvisoryEmail(
        "Approval requested",
        "Approval requested for the following advisory",
        newPublicAdvisoryAudit.advisoryNumber,
        "public-advisory-audit::lifecycles::afterCreate()"
      );
    }

    if (newAdvisoryStatus === "PUB" && newPublicAdvisoryAudit.isUrgentAfterHours) {
      await queueAdvisoryEmail(
        "After-hours advisory posted",
        "An after-hours advisory was posted",
        newPublicAdvisoryAudit.advisoryNumber,
        "public-advisory-audit::lifecycles::afterCreate()"
      );
    }

    copyToPublicAdvisory(newPublicAdvisoryAudit);
  },
  beforeUpdate: async (ctx) => {
    if (disabled) return;
    let { data, where } = ctx.params;
    const newPublicAdvisory = data;
    if (!newPublicAdvisory.publishedAt) return;

    newPublicAdvisory.publishedAt = new Date();
    newPublicAdvisory.isLatestRevision = true;
    const oldPublicAdvisory = await strapi.documents('api::public-advisory-audit.public-advisory-audit').findOne({
      documentId: where.documentId,
      populate: "*"
    });

    if (!oldPublicAdvisory) return;
    if (!oldPublicAdvisory.publishedAt) return;

    // save the status of the old advisory so we can get it back in afterUpdate()
    ctx.state.oldStatus = oldPublicAdvisory.advisoryStatus?.code;

    const oldAdvisoryStatus = oldPublicAdvisory.advisoryStatus
      ? oldPublicAdvisory.advisoryStatus.code
      : "DFT";

    if (isAdvisoryEqual(newPublicAdvisory, oldPublicAdvisory)) return;

    // flow 5: system updates
    if (newPublicAdvisory.modifiedBy === "system") {
      await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
      newPublicAdvisory.revisionNumber = await getNextRevisionNumber(
        oldPublicAdvisory.advisoryNumber
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
        oldPublicAdvisory.advisoryNumber
      );
      return;
    }

    // flow 3: update published advisory
    if (oldAdvisoryStatus === "PUB") {
      await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
      newPublicAdvisory.revisionNumber = await getNextRevisionNumber(
        oldPublicAdvisory.advisoryNumber
      );
      return;
    }
  },
  afterUpdate: async (ctx) => {
    if (disabled) return;
    const publicAdvisoryAudit = await strapi.documents('api::public-advisory-audit.public-advisory-audit').findOne({
      documentId: ctx.result.documentId,
      populate: "*"
    });

    const oldAdvisoryStatus = ctx.state.oldStatus; // saved by beforeUpdate() above
    const newAdvisoryStatus = publicAdvisoryAudit.advisoryStatus?.code;

    if (newAdvisoryStatus === "ARQ" && oldAdvisoryStatus !== "ARQ") {
      await queueAdvisoryEmail(
        "Approval requested",
        "Approval requested for the following advisory",
        publicAdvisoryAudit.advisoryNumber,
        "public-advisory-audit::lifecycles::afterUpdate()"
      );
    }

    if (
      newAdvisoryStatus === "PUB" && oldAdvisoryStatus !== "PUB" &&
      publicAdvisoryAudit.modifiedByRole === "submitter" && publicAdvisoryAudit.isUrgentAfterHours
    ) {
      await queueAdvisoryEmail(
        "After-hours advisory posted",
        "An after-hours advisory was posted",
        publicAdvisoryAudit.advisoryNumber,
        "public-advisory-audit::lifecycles::afterUpdate()"
      );
    }

    copyToPublicAdvisory(publicAdvisoryAudit);
  },
};

