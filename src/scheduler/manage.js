const dotenv = require("dotenv");

const { scriptKeySpecified, idSpecified } = require("./shared/commandLine");
const { getLogger } = require("./shared/logging");
const { indexParks } = require("./elasticsearch/scripts/indexParks");
const { createParkIndex, parkIndexExists } = require("./elasticsearch/scripts/createParkIndex");
const { deleteParkIndex } = require("./elasticsearch/scripts/deleteParkIndex");
const { queueAll } = require("./elasticsearch/scripts/queueAllParks");
const { populateGeoShapes } = require("./elasticsearch/scripts/populateGeoShapes");
const { triggerAdvisories } = require("./advisory-scheduling/scripts/triggerScheduled");
const { sendAdvisoryEmails } = require("./email-alerts/scripts/sendAdvisoryEmails");
const { sendParkNamesEmails } = require("./email-alerts/scripts/sendParkNamesEmails");
const { dootPublish } = require("./doot/scripts/publish");

(async () => {
  dotenv.config({
    path: `.env`,
  });

  const logger = getLogger();

  /**
   * Re-indexes all parks
   * (manually triggered via OpenShift terminal)
   */
  if (scriptKeySpecified("reindex")) {
    if (!(await parkIndexExists())) {
      logger.warn("The Elasticsearch index is missing. It will be recreated.");
      await createParkIndex();
    }
    logger.info("Reindexing all protectedAreas");
    await queueAll();
    // process the queue in the opposite order to the cron job to minimize duplication
    await indexParks({ descending: true });
    return;
  }

  /**
   * Re-creates the park search index and indexes all parks
   * (manually triggered via OpenShift terminal)
   */
  if (scriptKeySpecified("rebuild")) {
    logger.info("Recreating the park search index and reindexing all protectedAreas");
    await deleteParkIndex();
    await createParkIndex();
    await queueAll();
    // process the queue in the opposite order to the cron job to minimize duplication
    await indexParks({ descending: true });
    return;
  }

  /**
   * Deletes the park index from Elasticsearch
   * (manually triggered via OpenShift terminal)
   */
  if (scriptKeySpecified("deleteindex")) {
    logger.info("Deleting the park search index");
    await deleteParkIndex();
    return;
  }

  /**
   * Populates the geo-shapes collection in Strapi
   * (manually triggered via OpenShift terminal)
   */
  if (scriptKeySpecified("geoshapes")) {
    logger.info("Populating geoshapes");
    await populateGeoShapes();
    return;
  }

  /**
   * Runs the cron task one time
   * (manually triggered via OpenShift terminal / mainly for debugging purposes)
   */
  if (scriptKeySpecified("indexparks")) {
    if (!(await parkIndexExists())) {
      logger.warn("The Elasticsearch index is missing. It will be recreated.");
      await createParkIndex();
    }
    logger.info("Reindexing protectedAreas based on queued-tasks");
    // process the queue in the opposite order to the cron job to minimize duplication
    await indexParks({ descending: true });
    return;
  }

  /**
   * Indexes a specific park id
   * (manually triggered via terminal / mainly for local debugging)
   */
  if (idSpecified()) {
    logger.info(`Indexing park orcs #${process.argv[2]}`);
    await indexParks({ orcs: Number(process.argv[2]) });
    return;
  }

  /**
   * Trigger scheduled public advisory publishing & expiry
   * (manually triggered via OpenShift terminal / mainly for debugging purposes)
   */
  if (scriptKeySpecified("advisories")) {
    logger.info("Triggering scheduled public advisory publishing & expiry");
    await triggerAdvisories();
    return;
  }

  /**
   * Trigger sending queued emails
   * (manually triggered via OpenShift terminal / mainly for debugging purposes)
   */
  if (scriptKeySpecified("emailsend")) {
    logger.info("Sending queued emails");
    await sendAdvisoryEmails([]);
    await sendParkNamesEmails();
    return;
  }

  /**
   * Write emails to a file instead of sending them
   */
  if (scriptKeySpecified("emailtest")) {
    logger.info("Writing rendered email templates to 'mail-test-[#].html'");
    await sendAdvisoryEmails([]);
    await sendParkNamesEmails();
    return;
  }

  /**
   * Publish queued DOOT data to Strapi
   * (manually triggered via OpenShift terminal / mainly for debugging purposes)
   */
  if (scriptKeySpecified("dootpublish")) {
    logger.info("Publishing queued DOOT data to Strapi");
    await dootPublish();
    return;
  }

  console.log("\nUsage: \n");
  console.log("node manage.js [command]\n");
  console.log("Command options:\n");
  console.log("help        : show this screen");
  console.log("reindex     : re-index all parks");
  console.log("rebuild     : re-create the park index and re-index all parks");
  console.log("deleteindex : delete the park index");
  console.log("indexparks  : run the indexParks task one time");
  console.log("geoshapes   : populate the geo-shapes collection in Strapi");
  console.log("[integer]   : re-index a specified orcs");
  console.log("advisories  : trigger scheduled public advisory publishing & expiry");
  console.log("emailsend   : send queued emails");
  console.log("emailtest   : test email template (writes to file 'mail-test-[#].html')");
  console.log("dootpublish : publish queued DOOT data to Strapi\n");
})();
