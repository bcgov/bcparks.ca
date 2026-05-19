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
  let processedTasks;
  do {
    processedTasks = [];
    try {
      queue = await readQueue("elastic batch-queue parks");
    } catch (error) {
      logger.error(
        `batchQueueParks() failed while retrieving 'elastic batch-queue parks' tasks: ${error}`,
      );
      return;
    }

    for (const task of queue) {
      const parkDocumentIds = task.jsonData?.parkDocumentIds || [];

      // Convert documentIds to orcs in batches of 50 to avoid URL length issues
      const batchSize = 50;
      const orcsValues = [];

      for (let i = 0; i < parkDocumentIds.length; i += batchSize) {
        const batchIds = parkDocumentIds.slice(i, i + batchSize);
        const query = qs.stringify(
          {
            filters: {
              documentId: { $in: batchIds },
            },
            fields: ["orcs"],
          },
          { encodeValuesOnly: true },
        );

        let parks;
        try {
          parks = await cmsAxios.get(`/api/protected-areas?${query}`);
          orcsValues.push(...parks.data.data.map((park) => park.orcs));
        } catch (error) {
          logger.error(`batchQueueParks() failed while retrieving parks: ${error}`);
          return;
        }
      }

      let isError = false;
      for (const orcs of orcsValues) {
        try {
          if (!(await existsInQueue("elastic index park", orcs))) {
            const addedToQueue = await addToQueue({
              data: { action: "elastic index park", numericData: orcs },
            });
            if (!addedToQueue) {
              isError = true;
            }
          }
        } catch (error) {
          isError = true;
          logger.error(`batchQueueParks() failed while adding park ${orcs} to queue: ${error}`);
        }
      }
      if (!isError) {
        try {
          await removeFromQueue([task.documentId]);
          processedTasks.push(task.documentId);
        } catch (error) {
          logger.error(
            `batchQueueParks() failed while removing batch-queue task from queue: ${error}`,
          );
          return;
        }
      }
    }
  } while (processedTasks.length > 0);
};
