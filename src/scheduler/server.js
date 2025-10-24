const schedule = require("node-schedule");
const dotenv = require("dotenv");
const { exec } = require("child_process");

const { getLogger } = require("./shared/logging");
const { indexParks } = require("./elasticsearch/scripts/indexParks");
const { createParkIndex, parkIndexExists } = require("./elasticsearch/scripts/createParkIndex");
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

  let recentAdvisoryEmails = [];

  /**
   * Starts the cron job to reindex parks as entries are added to the queuedTasks
   * collection in Strapi
   */

  logger.info("Starting cron scheduler");

  // record pod readiness for health checks when the cron job first starts
  // (use shell command to prevent file locking)
  exec("date +%s > lastrun.txt");

  // run every minute
  schedule.scheduleJob("strapi-cron", "*/1 * * * *", async () => {
    const runningJobs = schedule.scheduledJobs["strapi-cron"].running;
    if (runningJobs > 0) {
      logger.warn(`Skipping the next cron. A previous job is still running.`);
      return;
    }
    try {
      logger.info("Starting cron");
      recentAdvisoryEmails = await sendAdvisoryEmails(recentAdvisoryEmails);
      await sendParkNamesEmails();
      await populateGeoShapes({ silent: true });
      if (!(await parkIndexExists())) {
        logger.warn("The Elasticsearch index is missing. It will be recreated and repopulated");
        await createParkIndex();
        await queueAll();
        // the cron job and the one-time indexing tasks process the queue in opposite order
        // to avoid duplication of effort
        await indexParks({ descending: true });
      } else {
        await indexParks();
      }
      // run this task AFTER indexing parks. Changes to advisories will cause affected
      // parks to be re-indexed a second time. This gives a 1 minute buffer to ensure
      // that all the lifecycle hooks and postgres replication have completed before
      // sending data to Elasticsearch (See CMS-239 for details.)
      await triggerAdvisories();

      await dootPublish();

      // record pod liveness for health check every time the job runs
      // (use shell command to prevent file locking)
      exec("date +%s > lastrun.txt");
    } catch (error) {
      logger.error(`Error running cron task: ${error}`);
    }
  });
})();
