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
  return maxAdvisoryNumber + 1;
};

const createPublicAdvisoryAudit = async (data) => {
  strapi.services["public-advisory-audit"].create(data).catch((error) => {
    strapi.log.error(
      `error creating public-advisory ${publicAdvisory.id}...`,
      error
    );
  });
};

const savePublicAdvisory = (publicAdvisory) => {
  strapi.log.info("creating public-advisory...");
  publicAdvisory.published_at =
    publicAdvisory.advisoryStatus.code === "PUB" ? new Date() : null;
  strapi.services["public-advisory"]
    .update({ advisoryNumber: publicAdvisory.advisoryNumber }, publicAdvisory)
    .catch(async () => {
      strapi.log.info(`updating publicAdvisory ${publicAdvisory.id}...`);
      strapi.services["public-advisory"]
        .create(publicAdvisory)
        .catch((error) => {
          strapi.log.error(
            `error creating public-advisory ${publicAdvisory.id}...`,
            error
          );
        });
    });
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
    beforeUpdate: async (id, newPublicAdvisory) => {
      const params = { ...id, _publicationState: "preview" };
      const oldPublicAdvisory = await strapi.services[
        "public-advisory-audit"
      ].findOne(params);

      const defaultAdvisoryStatus = await strapi.services[
        "advisory-status"
      ].findOne({
        code: "DFT",
      });

      console.log(newPublicAdvisory.advisoryStatus);

      const newAdvisoryStatus = newPublicAdvisory.advisoryStatus
        ? newPublicAdvisory.advisoryStatus
        : defaultAdvisoryStatus.id;
      const oldAdvisoryStatus = oldPublicAdvisory.advisoryStatus
        ? oldPublicAdvisory.advisoryStatus.id
        : defaultAdvisoryStatus.id;

      // create new audit if status changed
      if (oldPublicAdvisory) {
        if (newAdvisoryStatus !== oldAdvisoryStatus) {
          console.log(newPublicAdvisory.advisoryStatus, oldAdvisoryStatus);
          oldPublicAdvisory.id = 0;
          oldPublicAdvisory.published_at = null;
          oldPublicAdvisory.isLatestRevision = false;
          createPublicAdvisoryAudit(oldPublicAdvisory);
          newPublicAdvisory.published_at = new Date();
          newPublicAdvisory.isLatestRevision = true;
          newPublicAdvisory.revisionNumber++;
        }
      }
    },
    afterUpdate: async (newPublicAdvisory) => {
      if (!newPublicAdvisory.advisoryStatus) return;

      const oldPublicAdvisory = await strapi.services[
        "public-advisory"
      ].findOne({
        advisoryNumber: newPublicAdvisory.advisoryNumber,
      });

      // published, update for status PUB & INA
      const publishedStatuses = ["PUB", "INA"];
      if (
        oldPublicAdvisory &&
        oldPublicAdvisory.advisoryStatus &&
        publishedStatuses.includes(oldPublicAdvisory.advisoryStatus.code)
      ) {
        if (publishedStatuses.includes(newPublicAdvisory.advisoryStatus.code)) {
          savePublicAdvisory(newPublicAdvisory);
        }
        return;
      }
      // unpublished
      const unpublishedStatuses = ["ARQ", "APR", "PUB", "INA"];
      if (unpublishedStatuses.includes(newPublicAdvisory.advisoryStatus.code)) {
        savePublicAdvisory(newPublicAdvisory);
      }
    },
  },
};
