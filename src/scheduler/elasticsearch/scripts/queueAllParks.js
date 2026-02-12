const { cmsAxios } = require("../../shared/axiosConfig");
const { getLogger } = require("../../shared/logging");

/**
 * Adds all protectedAreas to the queuedTasks so they will
 * be reindexed by the cron job
 */
exports.queueAll = async function () {
  const logger = getLogger();
  try {
    await cmsAxios.post("/api/search-indexing/all", {});
  } catch (error) {
    logger.error(`queueAllParks.js failed: ${error}`);
  }

  logger.info("Set all parks to require reindexing");
};
