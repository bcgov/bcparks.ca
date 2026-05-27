/**
 * Creates an archived copy of the provided advisory data.
 */
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
  savePublicAdvisory,
  copyToPublicAdvisory,
  isAdvisoryEqual,
};
