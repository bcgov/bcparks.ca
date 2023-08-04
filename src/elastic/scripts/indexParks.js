const axios = require('axios');
const { getLogger } = require('../utils/logging');
const { createElasticPark } = require('../transformers/park');
const { readQueue, removeFromQueue } = require('../utils/taskQueue');
const elasticClient = require('../utils/elasticClient');
const qs = require('qs');
const { parkIndexExists } = require('./createParkIndex');

exports.indexParks = async function () {

  elasticClient.initializeESClient();
  const logger = getLogger();

  let parkList;
  let queue;

  // process items from the queue with the action 'elastic index park'
  let indexed;
  do {
    indexed = [];
    try {
      queue = await readQueue("elastic index park");
      parkList = await getBatch(queue);
    } catch (error) {
      logger.error(`indexParks() failed while reading queued tasks: ${error}`);
      process.exit(1);
    }

    for (const park of parkList) {
      logger.info(`indexing park ${park.id}`);
      if (await indexPark(park)) {
        indexed.push(taskId(queue, park.id))
      } else {
        logger.error(`error indexing park ${park.id}`)
      }
    }
    await removeFromQueue(indexed);
  } while (indexed.length > 0)

  // process items from the queue with the action 'elastic remove park'
  let removed;
  do {
    removed = [];
    try {
      queue = await readQueue("elastic remove park");
    } catch (error) {
      logger.error(`indexParks() failed while reading queued tasks: ${error}`);
      process.exit(1);
    }

    for (const task of queue) {
      const id = task.attributes.numericData;
      logger.info(`removing park ${task.attributes.numericData}`);
      if (await removePark(id)) {
        removed.push(taskId(queue, id));
      } else {
        logger.error(`error removing park ${id}`);
      }
    }
    await removeFromQueue(removed);
  } while (removed.length > 0);

  if (indexed.length || removed.length) {
    logger.info("DONE!");
  }
};

/**
 *  Adds a single park to Elasticsearch
 */
const indexPark = async function (park) {
  if (!park) {
    return false;
  }

  // if the park isn't visible on the website then remove it from 
  // Elasticsearch instead of adding it
  if (!park.isDisplayed || !park.publishedAt) {
    await removePark(park)
    return true;
  }

  // transform the Strapi object into an Elasticsearch object
  const doc = await createElasticPark(park);

  // send the data to elasticsearch
  try {
    await elasticClient.indexPark({ itemId: doc.id, document: doc });
  } catch (error) {
    getLogger().error(error);
    return false;
  }
  return true;
}

/**
 *  Removes a single park from Elasticsearch
 */
const removePark = async function (protectedAreaId) {
  try {
    await elasticClient.removePark({ itemId: protectedAreaId });
  } catch (error) {
    getLogger().error(error);
    return false;
  }
  return true;
}

/**
 * Gets multiple parks from Strapi for indexing based
 * on an array of queuedTasks passed into the function
 */
const getBatch = async function (queuedTasks) {
  if (queuedTasks.length === 0) {
    return [];
  }
  const queueParkIds = queuedTasks.map(q => +q.attributes.numericData);
  const parksFilters = qs.stringify({
    filters: {
      id: {
        $in: queueParkIds,
      },
    }
  }, {
    encodeValuesOnly: true,
  })
  const parksQuery = `${process.env.STRAPI_BASE_URL}/api/search/indexing/parks?${parksFilters}`;
  const response = await axios.get(parksQuery);
  parkList = response.data.data;
  getLogger().info(`Got ${parkList.length} parks from Strapi`);
  return parkList;
}

/**
 * Looks up the id of a queued task based on the associated park id
 */
const taskId = function (queue, parkId) {
  return queue.find(f => f.attributes.numericData === parkId)?.id
}
