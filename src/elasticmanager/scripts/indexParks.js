const axios = require('axios');
const { getLogger } = require('../utils/logging');
const { createElasticPark } = require('../transformers/park');
const { readQueue, removeFromQueue } = require('../utils/taskQueue');
const elasticClient = require('../utils/elasticClient');
const qs = require('qs');

exports.indexParks = async function (options) {

  elasticClient.initializeESClient();
  const logger = getLogger();

  let parkList;
  let photoList;
  let queue;

  // process items from the queue with the action 'elastic index park'
  let indexed;
  do {
    indexed = [];
    try {
      queue = await readQueue("elastic index park", options);
    } catch (error) {
      logger.error(`indexParks() failed while retrieving 'elastic index park' tasks: ${error}`);
      return;;
    }

    try {
      parkList = await getBatch(queue, options);
    } catch (error) {
      logger.error(`indexParks() failed while retrieving parks: ${error}`);
      return;;
    }

    try {
      const orcsList = parkList.map(p => { return p.orcs });
      photoList = await getPhotos(orcsList);
    } catch (error) {
      logger.error(`indexParks() failed while retrieving photos: ${error}`);
      return;;
    }

    for (const park of parkList) {
      logger.info(`indexing park ${park.id}`);
      if (await indexPark(park, photoList)) {
        indexed.push(taskId(queue, park.id))
      } else {
        logger.error(`error indexing park ${park.id}`)
      }
    }
    try {
      await removeFromQueue(indexed);
    } catch (error) {
      logger.error(`Failed while removing queued 'elastic index park' tasks: ${error}`);
      return;;
    }
  } while (indexed.length > 0)

  // process items from the queue with the action 'elastic remove park'
  let removed;
  do {
    removed = [];
    try {
      queue = await readQueue("elastic remove park", options);
    } catch (error) {
      logger.error(`indexParks() failed while retrieving 'elastic remove park' tasks: ${error}`);
      return;;
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
    try {
      await removeFromQueue(removed);
    } catch (error) {
      logger.error(`Failed while removing queued 'elastic remove park' tasks: ${error}`);
      return;;
    }
  } while (removed.length > 0);

  parkList = null;
  photoList = null;
  queue = null;

  if (indexed.length || removed.length) {
    logger.info("DONE!");
  }
};

/**
 *  Adds a single park to Elasticsearch
 */
const indexPark = async function (park, photos) {
  if (!park) {
    return false;
  }

  // if the park isn't visible on the website then remove it from 
  // Elasticsearch instead of adding it
  if (!park.isDisplayed || !park.publishedAt) {
    getLogger().warn(`removing park ${park.id} due to unpublished or undisplayed status`);
    await removePark(park)
    return true;
  }

  // transform the Strapi object into an Elasticsearch object
  const doc = await createElasticPark(park, photos);

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
const removePark = async function (park) {
  try {
    await elasticClient.removePark({ itemId: park.id });
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
const getBatch = async function (queuedTasks, options) {
  if (queuedTasks.length === 0) {
    return [];
  }
  const sort = options?.descending ? "id:DESC" : "id";
  const queueParkIds = queuedTasks.map(q => +q.attributes.numericData);
  const parksFilters = qs.stringify({
    filters: {
      id: {
        $in: queueParkIds,
      },
    },
    sort: sort
  }, {
    encodeValuesOnly: true,
  });
  const parksQuery = `${process.env.STRAPI_BASE_URL}/api/search-indexing/parks?${parksFilters}`;
  const httpReqHeaders = {
    'Authorization': 'Bearer ' + process.env.STRAPI_API_TOKEN,
    'Content-Type': 'application/json'
  };
  const response = await axios.get(parksQuery, { headers: httpReqHeaders });
  const parkList = response.data.data;
  getLogger().info(`Got ${parkList.length} protected areas from Strapi`);
  return parkList;
}

const getPhotos = async function (orcsList) {
  if (orcsList.length === 0) {
    return [];
  }
  const photoFilters = qs.stringify({
    filters: {
      orcs: {
        $in: orcsList,
      },
    }
  }, {
    encodeValuesOnly: true,
  });
  const photosQuery = `${process.env.STRAPI_BASE_URL}/api/search-indexing/photos?${photoFilters}`;
  const httpReqHeaders = {
    'Authorization': 'Bearer ' + process.env.STRAPI_API_TOKEN,
    'Content-Type': 'application/json'
  };
  const response = await axios.get(photosQuery, { headers: httpReqHeaders });
  const photosList = response.data;
  getLogger().info(`Got ${photosList.length} park photo records from Strapi`);
  return photosList;
}


/**
 * Looks up the id of a queued task based on the associated park id
 */
const taskId = function (queue, parkId) {
  return queue.find(f => f.attributes.numericData === parkId)?.id
}
