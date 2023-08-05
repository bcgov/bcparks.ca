const axios = require('axios');
const { getLogger } = require('../utils/logging');
const qs = require('qs');

const readQueue = async function (actionName) {
  const query = qs.stringify({
    fields: ["numericData", "jsonData"],
    filters: {
      action: `${actionName}`
    },
    pagination: {
      limit: 50
    }
  }, {
    encodeValuesOnly: true,
  })
  const queueQuery = `${process.env.STRAPI_BASE_URL}/api/queued-tasks?${query}`;
  const queueResponse = await axios.get(queueQuery);
  const queuedTasks = queueResponse.data.data;
  getLogger().info(`Got ${queuedTasks.length} "${actionName}" tasks from the queue`);
  return queuedTasks;
}

const removeFromQueue = async function (queueIds) {

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

module.exports = {
  readQueue,
  removeFromQueue
}
