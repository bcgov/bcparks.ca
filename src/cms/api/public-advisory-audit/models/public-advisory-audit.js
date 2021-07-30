"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const getNextAdvisoryNumber = async () => {
  const result = await strapi
    .query("public-advisory-audit")
    .model.query((qb) => {
      qb.max("advisoryNumber");
    })
    .fetch();
  let { max: maxAdvisoryNumber } = await result.toJSON();
  if (!maxAdvisoryNumber || maxAdvisoryNumber < 0) maxAdvisoryNumber = 0;
  return ++maxAdvisoryNumber;
};

const getNextRevisionNumber = async (advisoryNumber) => {
  const result = await strapi
    .query("public-advisory-audit")
    .model.query((qb) => {
      qb.where("advisoryNumber", advisoryNumber);
      qb.max("revisionNumber");
    })
    .fetch();
  let { max: maxRevisionNumber } = await result.toJSON();
  if (!maxRevisionNumber || maxRevisionNumber < 0) maxRevisionNumber = 0;
  return ++maxRevisionNumber;
};

const getPublishedRevisionNumber = async (advisoryNumber) => {
  const publishedAdvisory = await strapi.services["public-advisory"].findOne({
    advisoryNumber: advisoryNumber,
    "advisoryStatus.code": "PUB",
  });
  return publishedAdvisory ? publishedAdvisory.revisionNumber : 0;
};

const createPublicAdvisoryAudit = async (data) => {
  data.id = 0;
  data.published_at = null;
  data.isLatestRevision = false;

  strapi.services["public-advisory-audit"].create(data).catch((error) => {
    strapi.log.error(
      `error creating public-advisory ${publicAdvisory.id}...`,
      error
    );
  });
};

const savePublicAdvisory = async (publicAdvisory) => {
  if (publicAdvisory.advisoryStatus.code === "PUB") {
    publicAdvisory.published_at = new Date();
    strapi.services["public-advisory"]
      .update({ advisoryNumber: publicAdvisory.advisoryNumber }, publicAdvisory)
      .catch(async () => {
        strapi.services["public-advisory"]
          .create(publicAdvisory)
          .catch((error) => {
            strapi.log.error(
              `error creating public-advisory ${publicAdvisory.id}...`,
              error
            );
          });
      });
  } else {
    strapi.services["public-advisory"]
      .delete({
        advisoryNumber: publicAdvisory.advisoryNumber,
        _publicationState: "preview",
      })
      .catch((error) => {
        strapi.log.error(
          `error deleting public-advisory ${publicAdvisory.id}...`,
          error
        );
      });
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
  lifecycles: {
    beforeCreate: async (data) => {
      if (!data.revisionNumber && !data.advisoryNumber) {
        data.advisoryNumber = await getNextAdvisoryNumber();
        data.revisionNumber = 1;
        data.isLatestRevision = true;
        data.published_at = new Date();
      }
    },
    afterCreate: async (newPublicAdvisory) => {
      copyToPublicAdvisory(newPublicAdvisory);
    },
    beforeUpdate: async (id, newPublicAdvisory) => {
      if (!newPublicAdvisory.published_at) return;

      const params = { ...id, _publicationState: "preview" };

      newPublicAdvisory.published_at = new Date();
      newPublicAdvisory.isLatestRevision = true;

      const oldPublicAdvisory = await strapi.services[
        "public-advisory-audit"
      ].findOne(params);

      if (!oldPublicAdvisory) return;
      if (!oldPublicAdvisory.published_at) return;

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
    afterUpdate: async (newPublicAdvisory) => {
      copyToPublicAdvisory(newPublicAdvisory);
    },
  },
};
