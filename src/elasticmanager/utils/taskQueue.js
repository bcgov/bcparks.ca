const axios = require('axios');
const { getLogger } = require('../utils/logging');
const qs = require('qs');

const readQueue = async function (actionName, options) {
  const sort = options?.descending ? "numericData:DESC" : "numericData";
  const query = qs.stringify({
    fields: ["numericData", "jsonData"],
    filters: {
      action: `${actionName}`
    },
    pagination: {
      limit: +process.env.BATCH_SIZE
    },
    sort: sort
  }, {
    encodeValuesOnly: true,
  })

  const httpReqHeaders = {
    'Authorization': 'Bearer ' + process.env.STRAPI_API_TOKEN,
    'Content-Type': 'application/json'
  };

  const queueQuery = `${process.env.STRAPI_BASE_URL}/api/queued-tasks?${query}`;
  const queueResponse = await axios.get(queueQuery, { headers: httpReqHeaders });
  const queuedTasks = queueResponse.data.data;
  if (queuedTasks.length > 0) {
    getLogger().info(`Got ${queuedTasks.length} "${actionName}" tasks from the queue`);
  }
  return queuedTasks;
}

const removeFromQueue = async function (queueIds) {
  if (queueIds?.length > 0) {
    const httpReqHeaders = {
      'Authorization': 'Bearer ' + process.env.STRAPI_API_TOKEN,
      'Content-Type': 'application/json'
    };

    try {
      const deleteQuery = `${process.env.STRAPI_BASE_URL}/api/queued-tasks/bulk-delete`;
      await axios.post(deleteQuery, queueIds, { headers: httpReqHeaders });
    } catch (error) {
      getLogger().error(error);
    }
  }
}

module.exports = {
  readQueue,
  removeFromQueue
}
