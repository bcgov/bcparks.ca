const { cmsAxios } = require("../../shared/axiosConfig");
const { getLogger } = require("../../shared/logging");
const { readQueue, removeFromQueue, addToQueue, existsInQueue } = require("../../shared/taskQueue");
const qs = require("qs");

/**
 * Looks up the orcs values for a list of documentIds and
 * creates "elastic index park" tasks for each
 */
exports.batchQueueParks = async function () {
  const logger = getLogger();
  let queue;

  // get items from the queue with the action 'elastic batch-queue parks'
  try {
    queue = await readQueue("elastic batch-queue parks");
  } catch (error) {
    logger.error(
      `batchQueueParks() failed while retrieving 'elastic batch-queue parks' tasks: ${error}`,
    );
    return;
  }

  for (const task of queue) {
    const query = qs.stringify(
      {
        filters: {
          documentId: { $in: task.jsonData.parkDocumentIds },
        },
        fields: ["orcs"],
      },
      { encodeValuesOnly: true },
    );

    let parks;
    try {
      parks = await cmsAxios.get(`/api/protected-areas?${query}`);
    } catch (error) {
      logger.error(`batchQueueParks() failed while retrieving parks: ${error}`);
      return;
    }

    let isError = false;
    for (const park of parks?.data?.data || []) {
      try {
        if (!(await existsInQueue("elastic index park", park.orcs))) {
          const addedToQueue = await addToQueue({
            data: { action: "elastic index park", numericData: park.orcs },
          });
          if (!addedToQueue) {
            isError = true;
          }
        }
      } catch (error) {
        isError = true;
        logger.error(`batchQueueParks() failed while adding park ${park.orcs} to queue: ${error}`);
      }
    }
    if (!isError) {
      try {
        await removeFromQueue([task.documentId]);
      } catch (error) {
        logger.error(`batchQueueParks() failed while removing batch-queue task from queue: ${error}`);
        return;
      }
    }
  }
};
