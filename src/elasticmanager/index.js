
const { readFile } = require('node:fs/promises');
const dotenv = require('dotenv');

const { scriptKeySpecified } = require('./utils/commandLine');
const { getLogger } = require('./utils/logging');

const { indexParks } = require('./scripts/indexParks');
const { createParkIndex, parkIndexExists } = require('./scripts/createParkIndex');
const { deleteParkIndex } = require('./scripts/deleteParkIndex');
const { queueAll } = require('./scripts/queueAllParks');

(async () => {
  dotenv.config({
    path: `.env`
  });

  const logger = getLogger();

  /**
   * Re-indexes all parks 
   * (manually triggered via OpenShift terminal)
   */
  if (scriptKeySpecified("reindex")) {
    if (!await parkIndexExists()) {
      logger.warn("The Elasticsearch index is missing. It will be recreated.");
      await createParkIndex();
    }
    logger.info("Reindexing all protectedAreas")
    await queueAll();
    // process the queue in the opposite order to the cron job to minimize duplication
    await indexParks({ descending: true });
  }

  /**
   * Re-creates the park search index and indexes all parks 
   * (manually triggered via OpenShift terminal)
   */
  if (scriptKeySpecified("rebuild")) {
    logger.info("Recreating the park search index and reindexing all protectedAreas")
    await deleteParkIndex();
    await createParkIndex();
    await queueAll();
    // process the queue in the opposite order to the cron job to minimize duplication
    await indexParks({ descending: true });
  }

  /**
 * Re-creates the park search index and indexes all parks 
 * (manually triggered via OpenShift terminal)
 */
  if (scriptKeySpecified("deleteindex")) {
    logger.info("Deleting the park search index")
    await deleteParkIndex();
  }

  /**
   * Runs the cron task one time 
   * (manually triggered via OpenShift terminal / mainly for debugging purposes)
   */
  if (scriptKeySpecified("once")) {
    if (!await parkIndexExists()) {
      logger.warn("The Elasticsearch index is missing. It will be recreated.");
      await createParkIndex();
    }
    logger.info("Reindexing protectedAreas based on queued-tasks");
    // process the queue in the opposite order to the cron job to minimize duplication    
    await indexParks({ descending: true });
  }
})();
