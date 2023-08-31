
const dotenv = require('dotenv');

const { scriptKeySpecified, idSpecified, noCommandLineArgs } = require('./utils/commandLine');
const { getLogger } = require('./utils/logging');
const { indexParks } = require('./scripts/indexParks');
const { createParkIndex, parkIndexExists } = require('./scripts/createParkIndex');
const { deleteParkIndex } = require('./scripts/deleteParkIndex');
const { queueAll } = require('./scripts/queueAllParks');
const { populateGeoShapes } = require('./scripts/populateGeoShapes');

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
    await populateGeoShapes();
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
    await populateGeoShapes();
    logger.info("Recreating the park search index and reindexing all protectedAreas")
    await deleteParkIndex();
    await createParkIndex();
    await queueAll();
    // process the queue in the opposite order to the cron job to minimize duplication
    await indexParks({ descending: true });
  }

  /**
 * Deletes the park index from Elasticsearch
 * (manually triggered via OpenShift terminal)
 */
  if (scriptKeySpecified("deleteindex")) {
    logger.info("Deleting the park search index")
    await deleteParkIndex();
  }


  /**
   * Populates the geo-shapes collection in Strapi
  * (manually triggered via OpenShift terminal)
   */
  if (scriptKeySpecified("geoshapes")) {
    await populateGeoShapes();
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
    await populateGeoShapes();
    logger.info("Reindexing protectedAreas based on queued-tasks");
    // process the queue in the opposite order to the cron job to minimize duplication    
    await indexParks({ descending: true });
  }

  /**
   * Indexes a specific park id
   * (manually triggered via terminal / mainly for local debugging)
   */
  if (idSpecified()) {
    await indexParks({ id: Number(process.argv[2]) });
  }

  if (noCommandLineArgs() || scriptKeySpecified("help")) {
    console.log("\nUsage: \n")
    console.log("node index.js [command]\n")
    console.log("Command options:\n")
    console.log("help        : show this screen")
    console.log("reindex     : re-index all parks")
    console.log("rebuild     : re-create the park index and re-index all parks")
    console.log("deleteindex : delete the park index")
    console.log("once        : run the cron task one time")
    console.log("geoshapes   : populate the geo-shapes collection in Strapi")
    console.log("[integer]   : re-index a specified protectedAreaId\n")
  }
})();
