const { cmsAxios } = require("../../shared/axiosConfig");
const { getLogger } = require("../../shared/logging");
const { readQueue, removeFromQueue, addToQueue, existsInQueue } = require("../../shared/taskQueue");

/**
 * Looks up the orcs values for a list if documentIds and
 * creates "elastic index park" tasks for each
 */
exports.batchQueue = async function () {
  const logger = getLogger();

  // get items from the queue with the action 'elastic batch-queue parks'
  try {
    queue = await readQueue("elastic batch-queue parks");
  } catch (error) {
    logger.error(
      `batchQueue() failed while retrieving 'elastic batch-queue parks' tasks: ${error}`,
    );
    return;
  }

  for (const task of queue) {
    const query = {
      filters: {
        documentId: { $in: task.jsonData },
      },
      fields: ["orcs"],
    };

    let parks;
    try {
      parks = await cmsAxios.get("/api/protected-areas", {
        params: query,
      });
    } catch (error) {
      logger.error(`batchQueue() failed while retrieving parks: ${error}`);
      return;
    }
    for (const park of parks?.data?.data || []) {
      try {
        if (!(await existsInQueue("elastic index park", park.attributes.orcs))) {
          await addToQueue("elastic index park", park.attributes.orcs);
        }
      } catch (error) {
        logger.error(
          `batchQueue() failed while adding park ${park.attributes.orcs} to queue: ${error}`,
        );
        return;
      }
    }
    try {
      await removeFromQueue([task.documentId]);
    } catch (error) {
      logger.error(`batchQueue() failed while removing batch-queue task from queue: ${error}`);
      return;
    }
  }
};
