const { getLogger } = require('../utils/logging');
const elasticClient = require('../utils/elasticClient');

/**
 * Deletes the park index from Elasticsearch so it can 
 * be recreated by createParkIndex.js
 */
exports.deleteParkIndex = async function () {
  elasticClient.initializeESClient();
  const logger = getLogger();

  try {
    await elasticClient.deleteParkIndex();
  } catch (error) {
    if (!JSON.stringify(error).includes("index_not_found_exception")) {
      logger.error("Error deleting park index");
      console.log(error);
    }
  }

  logger.info("Deleted the park index");
};
