const axios = require('axios');
const { getLogger } = require('../utils/logging');



/**
 * Adds all protectedAreas to the queuedTasks so they will 
 * be reindexed by the cron job
 */
exports.queueAll = async function () {
  const logger = getLogger();

  const httpReqHeaders = {
    'Authorization': 'Bearer ' + process.env.STRAPI_API_TOKEN,
    'Content-Type': 'application/json'
  };

  try {
    const allQuery = `${process.env.STRAPI_BASE_URL}/api/search/indexing/all`;
    await axios.post(allQuery, {}, { headers: httpReqHeaders });
  } catch (error) {
    logger.error(`queueAllParks.js failed: ${error}`);
  }

  logger.info("Set all parks to require reindexing")
};
