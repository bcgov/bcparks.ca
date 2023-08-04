const schedule = require("node-schedule");
const { writeFile, readFile } = require('node:fs/promises');
const dotenv = require('dotenv');

const { noCommandLineArgs, scriptKeySpecified } = require('./utils/commandLine');
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
   * Starts the cron job to reindex parks as entries are added to the queuedTasks 
   * collection in Strapi
   */
  if (noCommandLineArgs() || scriptKeySpecified("cron")) {
    logger.info("Starting cron scheduler");

    // record pod readiness for health checks when the cron job first starts
    await writeFile("lastrun.txt", JSON.stringify(new Date()));

    // run every 2 minutes on the :00
    schedule.scheduleJob("*/2 * * * *", async () => {
      try {
        if (!(await parkIndexExists())) {
          logger.warn(
            "The Elasticsearch index is missing. It will be recreated and repopulated"
          );
          await createParkIndex();
          await queueAll();
          await indexParks();
        } else {
          logger.info("Cron checking queued-tasks");
          await indexParks();
        }

        // record pod liveness for health check every time the job runs
        await writeFile("lastrun.txt", JSON.stringify(new Date()));
      } catch (error) {
        logger.error(`Error running cron task: ${error}`)
      }
    });
  }

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
    await indexParks();
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
    await indexParks();
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
    await indexParks();
  }

  /**
   * OpenShift liveness probe health check.
   * Checks if the cron job is still running by checking if a file was 
   * written to disk in the last 10 minutes.
   */
  if (scriptKeySpecified("liveness")) {
    const failure = 1;
    const success = 0;
    const failureMinutes = 10;
    try {
      const data = await readFile("lastrun.txt", "UTF-8");
      if (!data) {
        console.log(`FAILURE! lastrun.txt is missing or empty.`);
        process.exit(failure);
      }
      const dateLastRun = new Date(JSON.parse(data))
      const diffMinutes = (new Date().getTime() - dateLastRun.getTime()) / 60000;
      if (diffMinutes >= failureMinutes) {
        console.log(`FAILURE! Last cron run: ${dateLastRun.toLocaleString()}`);
        process.exit(failure);
      } else {
        console.log(`Success! Last cron run: ${dateLastRun.toLocaleString()}`);
        process.exit(success);
      }
    } catch (error) {
      console.log(`FAILURE! Exception occured`);
      console.log(error);
      process.exit(failure);
    }
  }
})();
