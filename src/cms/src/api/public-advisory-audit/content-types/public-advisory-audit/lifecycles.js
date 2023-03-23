"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const getNextAdvisoryNumber = async () => {
  const result = await strapi.db.query('api::public-advisory-audit.public-advisory-audit').findOne({
    orderBy: {
      advisoryNumber: 'DESC'
    }
  });
  let { advisoryNumber: maxAdvisoryNumber } = result;
  if (!maxAdvisoryNumber || maxAdvisoryNumber < 0) maxAdvisoryNumber = 0;
  return ++maxAdvisoryNumber;
};

const getNextRevisionNumber = async (advisoryNumber) => {
  const result = await strapi.db.query('api::public-advisory-audit.public-advisory-audit').findOne({
    where: {
      advisoryNumber
    },
    orderBy: {
      revisionNumber: 'DESC'
    }
  });
  let { revisionNumber: maxRevisionNumber } = result;
  if (!maxRevisionNumber || maxRevisionNumber < 0) maxRevisionNumber = 0;
  return ++maxRevisionNumber;
};

const getPublishedRevisionNumber = async (advisoryNumber) => {
  const publishedAdvisory = await strapi.db.query('api::public-advisory.public-advisory').findOne({
    where: {
      advisoryNumber,
      advisoryStatus: {
        code: 'PUB'
      }
    },
  });
  return publishedAdvisory ? publishedAdvisory.revisionNumber : 0;
};

const createPublicAdvisoryAudit = async (data) => {
  data.id = 0; //TODO:  why is that ?
  data.published_at = null;
  data.isLatestRevision = false;

  try {
    await strapi.db.query('api::public-advisory-audit.public-advisory-audit').create({data});
  } catch (error) {
    strapi.log.error(
      `error creating public-advisory-audit ${publicAdvisory.id}...`,
      error
    );
  }
};

const savePublicAdvisory = async (publicAdvisory) => {
  if (publicAdvisory.advisoryStatus.code === "PUB") {
    publicAdvisory.published_at = new Date();
    const isExist = await strapi.db.query('api::public-advisory.public-advisory').findOne({
      where: {
        advisoryNumber
      }
    });

    if(isExist) {
      try {
        await strapi.db.query('api::public-advisory.public-advisory').updateMany({
          where: {
            advisoryNumber: publicAdvisory.advisoryNumber,
          },
          data: publicAdvisory,
        });
      } catch (error) {
        strapi.log.error(
          `error updating public-advisory advisoryNumber ${publicAdvisory.advisoryNumber}...`,
          error
        );
      }
    } else {
      try {
        await strapi.db.query('api::public-advisory.public-advisory').create({
          data: publicAdvisory
        });
      } catch (error) {
        strapi.log.error(
          `error creating public-advisory ${publicAdvisory.id}...`,
          error
        );
      }
    }
  } else {
    try {
      await strapi.db.query('api::public-advisory.public-advisory').delete({
        where: {
          advisoryNumber: publicAdvisory.advisoryNumber,
          _publicationState: "preview",// TODO: need to check 'delete', or publicationState
        }
      });
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
    dcTicketNumber: null,
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
    isReservationsAffected: null,
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
    let { data } = ctx.params;
    if (!data.revisionNumber && !data.advisoryNumber) {
      data.advisoryNumber = await getNextAdvisoryNumber();
      data.revisionNumber = 1;
      data.isLatestRevision = true;
      data.published_at = new Date();
    }
  },
  afterCreate: async (ctx) => {
    copyToPublicAdvisory(ctx.result);
  },
  beforeUpdate: async (ctx) => {
    let { data: newPublicAdvisory, where: filter } = ctx.params;
    if (!newPublicAdvisory.publishedAt) return;

    newPublicAdvisory.publishedAt = new Date();
    newPublicAdvisory.isLatestRevision = true;
    const oldPublicAdvisory = await strapi.entityService.findOne('api::public-advisory-audit.public-advisory-audit', filter.id, {
      populate: '*',
    });



    if (!oldPublicAdvisory) return;
    if (!oldPublicAdvisory.publishedAt) return;

    const oldAdvisoryStatus = oldPublicAdvisory.advisoryStatus
      ? oldPublicAdvisory.advisoryStatus.code
      : "DFT";

    if (isAdvisoryEqual(newPublicAdvisory, oldPublicAdvisory)) return;

    // flow 5: system updates
    if (newPublicAdvisory.modifiedBy === "system") {
      await createPublicAdvisoryAudit(oldPublicAdvisory);
      return;
    }

    // flow 4: update inactive (set by system)
    if (
      oldAdvisoryStatus === "INA" &&
      oldPublicAdvisory.modifiedBy === "system"
    ) {
      await createPublicAdvisoryAudit(oldPublicAdvisory);
      newPublicAdvisory.revisionNumber = await getNextRevisionNumber(
        oldPublicAdvisory.advisoryNumber
      );
      return;
    }

    // flow 3: update published advisory
    oldAdvisoryStatus;
    if (oldAdvisoryStatus === "PUB") {
      await createPublicAdvisoryAudit(oldPublicAdvisory);
      newPublicAdvisory.revisionNumber = await getNextRevisionNumber(
        oldPublicAdvisory.advisoryNumber
      );
      return;
    }
  },
  afterUpdate: async (ctx) => {
    copyToPublicAdvisory(ctx.result);
  },
};
