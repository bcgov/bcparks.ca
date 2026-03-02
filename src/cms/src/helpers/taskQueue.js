module.exports = {
  indexPark: async function (orcs) {
    if (!orcs) {
      return;
    }
    const exists =
      (
        await strapi.documents("api::queued-task.queued-task").findMany({
          filters: {
            action: "elastic index park",
            numericData: orcs,
          },
        })
      ).length > 0;
    if (!exists) {
      try {
        await strapi.documents("api::queued-task.queued-task").create({
          data: {
            action: "elastic index park",
            numericData: orcs,
          },
        });
        strapi.log.info(`queued protectedArea ${orcs} for reindexing`);
      } catch (error) {
        strapi.log.error(error);
      }
    }
  },
  removePark: async function (orcs) {
    if (!orcs) {
      return;
    }
    const exists =
      (
        await strapi.documents("api::queued-task.queued-task").findMany({
          filters: {
            action: "elastic remove park",
            numericData: orcs,
          },
        })
      ).length > 0;
    if (!exists) {
      try {
        await strapi.documents("api::queued-task.queued-task").create({
          data: {
            action: "elastic remove park",
            numericData: orcs,
          },
        });
        strapi.log.info(`queued protectedArea ${orcs} for removal`);
      } catch (error) {
        strapi.log.error(error);
      }
    }
  },
  batchQueueParks: async function (documentIds) {
    if (
      !documentIds ||
      !Array.isArray(documentIds) ||
      documentIds.length === 0
    ) {
      return;
    }
    try {
      await strapi.documents("api::queued-task.queued-task").create({
        data: {
          action: "elastic batch-queue parks",
          jsonData: documentIds,
        },
      });
      strapi.log.info(
        `queued ${documentIds.length} documentIds for ORCS lookup and 'elastic index park' task creation`,
      );
    } catch (error) {
      strapi.log.error(error);
    }
  },
  queueAdvisoryEmail: async function (
    subject,
    title,
    advisoryNumber,
    triggerInfo,
  ) {
    if (!subject || !title || !advisoryNumber) {
      return;
    }
    const exists =
      (
        await strapi.documents("api::queued-task.queued-task").findMany({
          filters: {
            action: "email advisory",
            numericData: advisoryNumber,
          },
        })
      ).length > 0;
    if (!exists) {
      strapi.log.info(
        `queued advisoryNumber ${advisoryNumber} for "${subject}" notification`,
      );
      try {
        await strapi.documents("api::queued-task.queued-task").create({
          data: {
            action: "email advisory",
            numericData: advisoryNumber,
            jsonData: {
              subject: subject,
              title: title,
              advisoryNumber: advisoryNumber,
              triggeredBy: triggerInfo,
            },
          },
        });
      } catch (error) {
        strapi.log.error(error);
      }
    }
  },
};
