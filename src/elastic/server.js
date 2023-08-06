const schedule = require("node-schedule");
const { writeFile } = require('node:fs/promises');
const dotenv = require('dotenv');
const { exec } = require("child_process");

const { getLogger } = require('./utils/logging');

const { indexParks } = require('./scripts/indexParks');
const { createParkIndex, parkIndexExists } = require('./scripts/createParkIndex');
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

  logger.info("Starting cron scheduler");

  // record pod readiness for health checks when the cron job first starts
  // (use shell command to prevent file locking)
  exec(`echo '${JSON.stringify(new Date()).replace('"', '\"')}' > lastrun.txt`)

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
        logger.info("Starting cron");
        await indexParks();
      }

      // record pod liveness for health check every time the job runs
      // (use shell command to prevent file locking)
      exec(`echo '${JSON.stringify(new Date()).replace('"', '\"')}' > lastrun.txt`)
    } catch (error) {
      logger.error(`Error running cron task: ${error}`)
    }
  });

})();
