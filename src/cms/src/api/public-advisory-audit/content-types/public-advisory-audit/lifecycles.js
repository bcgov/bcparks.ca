"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const getNextAdvisoryNumber = async () => {
  const result = await strapi.db.query(
    "api::public-advisory-audit.public-advisory-audit"
  );
  // .model.query((qb) => {
  //   qb.max("advisory_number");
  // })
  // .fetch();

  let { max: maxAdvisoryNumber } = await result.toJSON();

  if (!maxAdvisoryNumber || maxAdvisoryNumber < 0) maxAdvisoryNumber = 0;
  return ++maxAdvisoryNumber;
};

const getNextRevisionNumber = async (advisoryNumber) => {
  const result = await strapi.db
    .query("api::public-advisory-audit.public-advisory-audit")
    .model.query((qb) => {
      qb.where("advisory_number", advisoryNumber);
      qb.max("advisory_number");
    })
    .fetch();

  // const result = await strapi.db.query("api::public-advisory-audit.public-advisory-audit")
  //   .findMany({
  //     where: { advisoryNumber: advisoryNumber },
  //     populate: "*",
  //   });

  let { max: maxRevisionNumber } = await result.toJSON();
  if (!maxRevisionNumber || maxRevisionNumber < 0) maxRevisionNumber = 0;
  return ++maxRevisionNumber;
};

const getPublishedRevisionNumber = async (advisoryNumber) => {
  // const publishedAdvisory = await strapi.entityService.findOne("api::public-advisory.public-advisory", 1, {
  //   // fields: ['advisoryNumber', 'advisoryNumber'], // or advisory_number?
  //   // sort: { 'advisoryStatus.code': 'PUB' },
  //   // populate: "*"
  // });

  const publishedAdvisory = await strapi.entityService.findOne(
    "api::public-advisory.public-advisory",
    { advisoryNumber: advisoryNumber },
    {
      // limit: -1, // in FE or BE ?
      populate: "*",
      // advisoryNumber: advisoryNumber,
      filters: {
        advisoryStatus: {
          code: "PUB",
        },
      },
    }
  );

  return publishedAdvisory ? publishedAdvisory.revisionNumber : 0;
};

const createPublicAdvisoryAudit = async (data) => {
  data.id = 0;
  data.published_at = null;
  data.isLatestRevision = false;

  strapi.entityService.create(
    "api::public-advisory-audit.public-advisory-audit",
    { data }
  );
  // strapi.log.error(
  //   `error creating public-advisory ${publicAdvisory.id}...`,
  //   error
  // );
};

const savePublicAdvisory = async (publicAdvisory) => {
  if (publicAdvisory.advisoryStatus.code === "PUB") {
    publicAdvisory.published_at = new Date();

    strapi.entityService.update("api::public-advisory.public-advisory", 1, {
      // .update({ advisoryNumber: publicAdvisory.advisoryNumber }, publicAdvisory)
      data: {
        advisoryNumber: publicAdvisory.advisoryNumber,
        ...publicAdvisory,
      },
    });
    // TODO: if .catch(async () => {
    strapi.entityService.create("api::public-advisory.public-advisory", {
      data: publicAdvisory,
    });
    // strapi.services["public-advisory"].create(publicAdvisory)
    //   .catch((error) => {
    //     strapi.log.error(
    //       `error creating public-advisory ${publicAdvisory.id}...`,
    //       error
    //     );
    //   });
    // });
  } else {
    strapi.entityService.delete(
      "api::public-advisory.public-advisory",
      publicAdvisory.advisoryNumber
    );
    // .delete({
    //   advisoryNumber: publicAdvisory.advisoryNumber,
    //   _publicationState: "preview",
    // })
    // .catch((error) => {
    //   strapi.log.error(
    //     `error deleting public-advisory ${publicAdvisory.id}...`,
    //     error
    //   );
    // });
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

    const oldPublicAdvisory = await strapi.entityService.findOne(
      "api::public-advisory-audit.public-advisory-audit",
      params
    );

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
};
