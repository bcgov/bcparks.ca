const { cmsAxios } = require("./axiosConfig");
const { getLogger } = require("./logging");
const { clearTaskErrors } = require("./taskErrors");
const qs = require("qs");

const readQueue = async function (actionName, options) {
  const sort = [options?.descending ? "numericData:DESC" : "numericData", "id"];
  const query = qs.stringify(
    {
      fields: ["numericData", "jsonData"],
      filters: {
        action: `${actionName}`,
      },
      pagination: {
        limit: +process.env.BATCH_SIZE,
      },
      sort: sort,
    },
    {
      encodeValuesOnly: true,
    },
  );
  const queueResponse = await cmsAxios.get(`/api/queued-tasks?${query}`);
  const queuedTasks = queueResponse.data.data;
  if (queuedTasks.length > 0) {
    getLogger().info(
      `Got ${queuedTasks.length} "${actionName}" tasks from the queue`,
    );
  }
  return queuedTasks;
};

/**
 * Adds a task to the queue.
 *
 * @param {Object} task Queued task to create, as { data: {...} }.
 * @param {string} [documentId] documentId of the queued task being processed
 *   when this one is added. When set, an error is saved as that task's last
 *   error.
 * @returns {Promise<boolean>} True when the task was added.
 */
const addToQueue = async function (task, documentId) {
  try {
    await cmsAxios.post("/api/queued-tasks", task);
    return true;
  } catch (error) {
    getLogger().error(error, documentId);
    return false;
  }
};

const removeFromQueue = async function (queueIds) {
  if (queueIds?.length > 0) {
    try {
      const deleteQuery = "/api/queued-tasks/bulk-delete";
      await cmsAxios.post(deleteQuery, queueIds);
    } catch (error) {
      getLogger().error(error);
    }
  }
};

const existsInQueue = async function (actionName, numericData) {
  const query = qs.stringify(
    {
      fields: ["documentId"],
      filters: {
        action: `${actionName}`,
        numericData: numericData,
      },
      pagination: {
        limit: 1,
      },
    },
    {
      encodeValuesOnly: true,
    },
  );
  const queueResponse = await cmsAxios.get(`/api/queued-tasks?${query}`);
  const queuedTasks = queueResponse.data.data;
  return queuedTasks.length > 0;
};

/**
 * Checks whether the queue has no tasks of any action.
 *
 * @returns {Promise<boolean>} True when the queue is empty.
 */
const isQueueEmpty = async function () {
  const query = qs.stringify(
    {
      fields: ["documentId"],
      pagination: {
        limit: 1,
      },
    },
    {
      encodeValuesOnly: true,
    },
  );
  const queueResponse = await cmsAxios.get(`/api/queued-tasks?${query}`);
  return queueResponse.data.meta.pagination.total === 0;
};

/**
 * Deletes all saved task errors once the queue is empty, so errors for tasks
 * that are no longer queued don't pile up on the PVC.
 *
 * @returns {Promise<void>} Resolves when the check (and any cleanup) is done.
 */
const clearTaskErrorsIfQueueEmpty = async function () {
  try {
    if (await isQueueEmpty()) {
      await clearTaskErrors();
    }
  } catch (error) {
    getLogger().warn(`Could not clear saved task errors: ${error}`);
  }
};

/**
 * Finds queued tasks that were created before a cutoff time, oldest first.
 *
 * @param {string[]} actionNames Queued-task actions to look for.
 * @param {Date} olderThan Only tasks created before this time are returned.
 * @param {number} [limit=25] Maximum number of tasks to return.
 * @returns {Promise<{tasks: Object[], total: number}>} The oldest matching
 *   tasks (with numericData and createdAt) and the total number that match.
 */
const getStuckTasks = async function (actionNames, olderThan, limit = 25) {
  const query = qs.stringify(
    {
      fields: ["action", "numericData", "createdAt"],
      filters: {
        action: { $in: actionNames },
        createdAt: { $lt: olderThan.toISOString() },
      },
      pagination: {
        limit: limit,
      },
      sort: ["createdAt", "id"],
    },
    {
      encodeValuesOnly: true,
    },
  );
  const queueResponse = await cmsAxios.get(`/api/queued-tasks?${query}`);
  const tasks = queueResponse.data.data;
  const total = queueResponse.data.meta?.pagination?.total ?? tasks.length;
  return { tasks, total };
};

module.exports = {
  getStuckTasks,
  readQueue,
  removeFromQueue,
  addToQueue,
  existsInQueue,
  clearTaskErrorsIfQueueEmpty,
};
