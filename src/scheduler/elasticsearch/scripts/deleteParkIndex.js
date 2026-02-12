const { getLogger } = require("../../shared/logging");
const elasticClient = require("../utils/elasticClient");

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
      logger.error(`deleteParkIndex() failed: ${error}`);
      return;
    }
  }

  logger.info("Deleted the park index");
};
