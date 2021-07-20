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

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (!data.revisionNumber && !data.advisoryNumber) {
        data.advisoryNumber = await getNextAdvisoryNumber();
        data.revisionNumber = 1;
        data.publishedRevisionNumber = 0;
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

      // create new audit if status changed
      if (oldPublicAdvisory && oldPublicAdvisory.published_at) {
        const newStatus = await strapi.services["advisory-status"].findOne({
          id: newPublicAdvisory.advisoryStatus
            ? newPublicAdvisory.advisoryStatus
            : 0,
        });

        const newAdvisoryStatus = newStatus ? newStatus.code : "DFT";
        const oldAdvisoryStatus = oldPublicAdvisory.advisoryStatus
          ? oldPublicAdvisory.advisoryStatus.code
          : "DFT";

        if (newAdvisoryStatus !== oldAdvisoryStatus) {
          oldPublicAdvisory.id = 0;
          oldPublicAdvisory.published_at = null;
          oldPublicAdvisory.isLatestRevision = false;
          await createPublicAdvisoryAudit(oldPublicAdvisory);

          newPublicAdvisory.revisionNumber = await getNextRevisionNumber(
            oldPublicAdvisory.advisoryNumber
          );

          switch (newAdvisoryStatus) {
            case "PUB":
              newPublicAdvisory.publishedRevisionNumber =
                newPublicAdvisory.revisionNumber;
              break;
            case "INA":
              newPublicAdvisory.publishedRevisionNumber = 0;
              break;
            default:
              newPublicAdvisory.publishedRevisionNumber =
                await getPublishedRevisionNumber(
                  oldPublicAdvisory.advisoryNumber
                );
          }
        }
      }
    },
    afterUpdate: async (newPublicAdvisory) => {
      copyToPublicAdvisory(newPublicAdvisory);
    },
  },
};
