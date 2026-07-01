const {
  queueRecSpacePublicAdvisoryCrudEvent,
} = require("../../helpers/taskQueue.js");

/**
 * Creates an archived copy of the provided advisory data.
 */
async function archiveOldPublicAdvisoryAudit(data) {
  delete data.id;
  delete data.documentId;
  delete data.updatedBy;
  delete data.createdBy;
  delete data.links; // keep links connected to the latest revision, not the archived version
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

async function savePublicAdvisoryAndRecSpaceSync(
  newPublicAdvisoryAudit,
  oldPublicAdvisoryAudit = null,
) {
  delete newPublicAdvisoryAudit.updatedBy;
  delete newPublicAdvisoryAudit.createdBy;

  const advisoryStatusCode = newPublicAdvisoryAudit.advisoryStatus?.code;

  // SCH advisories never write to the public-advisory projection table.
  // Always queue a RecSpace scheduled-create event, then stop.
  if (advisoryStatusCode === "SCH") {
    await queueRecSpacePublicAdvisoryCrudEvent(
      "create scheduled",
      "advisoryData::savePublicAdvisoryAndRecSpaceSync()#scheduled-public-advisory",
      newPublicAdvisoryAudit,
      oldPublicAdvisoryAudit,
    );
    return;
  }

  const isExist = await strapi
    .documents("api::public-advisory.public-advisory")
    .findFirst({
      filters: {
        advisoryNumber: newPublicAdvisoryAudit.advisoryNumber,
      },
      fields: ["id", "documentId", "advisoryNumber"],
    });

  if (advisoryStatusCode === "PUB") {
    if (isExist) {
      try {
        newPublicAdvisoryAudit.id = isExist.id;
        newPublicAdvisoryAudit.documentId = isExist.documentId;
        strapi.log.info(
          `updating public-advisory advisoryNumber ${newPublicAdvisoryAudit.advisoryNumber}...`,
        );
        await strapi.documents("api::public-advisory.public-advisory").update({
          documentId: isExist.documentId,
          data: newPublicAdvisoryAudit,
        });
        await queueRecSpacePublicAdvisoryCrudEvent(
          "update",
          "advisoryData::savePublicAdvisoryAndRecSpaceSync()#update-public-advisory",
          newPublicAdvisoryAudit,
          oldPublicAdvisoryAudit,
        );
      } catch (error) {
        strapi.log.error(
          `error updating public-advisory advisoryNumber ${newPublicAdvisoryAudit.advisoryNumber}...`,
          error,
        );
      }
    } else {
      try {
        delete newPublicAdvisoryAudit.id;
        delete newPublicAdvisoryAudit.documentId;
        strapi.log.info(
          `creating public-advisory advisoryNumber ${newPublicAdvisoryAudit.advisoryNumber}...`,
        );
        await strapi.documents("api::public-advisory.public-advisory").create({
          data: newPublicAdvisoryAudit,
        });
        await queueRecSpacePublicAdvisoryCrudEvent(
          "create",
          "advisoryData::savePublicAdvisoryAndRecSpaceSync()#create-public-advisory",
          newPublicAdvisoryAudit,
          oldPublicAdvisoryAudit,
        );
      } catch (error) {
        strapi.log.error(
          `error creating public-advisory ${newPublicAdvisoryAudit.id}...`,
          error,
        );
      }
    }
  } else if (isExist) {
    try {
      strapi.log.info(
        `deleting public-advisory advisoryNumber ${newPublicAdvisoryAudit.advisoryNumber}...`,
      );
      await strapi
        .documents("api::public-advisory.public-advisory")
        .delete({ documentId: isExist.documentId });
      await queueRecSpacePublicAdvisoryCrudEvent(
        "delete",
        "advisoryData::savePublicAdvisoryAndRecSpaceSync()#delete-public-advisory",
        newPublicAdvisoryAudit,
        oldPublicAdvisoryAudit,
      );
    } catch (error) {
      strapi.log.error(
        `error deleting public-advisory ${newPublicAdvisoryAudit.id}...`,
        error,
      );
    }
  }
}

async function syncProjections(newPublicAdvisory, oldPublicAdvisory = null) {
  if (newPublicAdvisory.isLatestRevision && newPublicAdvisory.advisoryStatus) {
    const triggerStatuses = ["PUB", "SCH", "UNP"];
    if (triggerStatuses.includes(newPublicAdvisory.advisoryStatus.code)) {
      await savePublicAdvisoryAndRecSpaceSync(
        newPublicAdvisory,
        oldPublicAdvisory,
      );
    }
  }
}

async function queueRecSpaceDelete(publicAdvisory, triggerInfo) {
  const advisoryStatusCode = publicAdvisory?.advisoryStatus?.code;
  const scheduledDeleteStatuses = ["UNP", "DFT", "HQR"];
  if (!scheduledDeleteStatuses.includes(advisoryStatusCode)) {
    return;
  }

  const isExist = await strapi
    .documents("api::public-advisory.public-advisory")
    .findFirst({
      filters: {
        advisoryNumber: publicAdvisory.advisoryNumber,
      },
      fields: ["advisoryNumber"],
    });

  // If there is a projection of the advisory in the public-advisory table,
  // then an earlier revision is currently published. Skip the delete
  // event so we don't delete the published advisory in RecSpace.
  if (isExist) {
    return;
  }

  await queueRecSpacePublicAdvisoryCrudEvent(
    "delete scheduled",
    triggerInfo,
    publicAdvisory,
  );
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
    recreationDistricts: [],
    recreationResources: [],
    isAdvisoryDateDisplayed: null,
    isEffectiveDateDisplayed: null,
    isEndDateDisplayed: null,
    isUpdatedDateDisplayed: null,
    isReservationsAffected: null,
    isUrgentAfterHours: null,
    modifiedByName: null,
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

module.exports = {
  archiveOldPublicAdvisoryAudit,
  queueRecSpaceDelete,
  syncProjections,
  isAdvisoryEqual,
};
