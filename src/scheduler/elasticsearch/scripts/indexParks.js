const qs = require("qs");
const { getLogger } = require("../../shared/logging");
const { createElasticPark } = require("../transformers/park/main");
const { readQueue, removeFromQueue } = require("../../shared/taskQueue");
const elasticClient = require("../utils/elasticClient");
const { cmsAxios } = require("../../shared/axiosConfig");

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

    if (options?.orcs) {
      // fake the readQueue response if we are indexing a specific park (by orcs).
      queue = [{ numericData: options.orcs }];
    } else {
      try {
        queue = await readQueue("elastic index park", options);
      } catch (error) {
        logger.error(`indexParks() failed while retrieving 'elastic index park' tasks: ${error}`);
        return;
      }
    }

    try {
      parkList = await getBatch(queue, options);
    } catch (error) {
      logger.error(`indexParks() failed while retrieving parks: ${error}`);
      return;
    }

    try {
      const orcsList = parkList.map((p) => {
        return p.orcs;
      });
      photoList = await getPhotos(orcsList);
    } catch (error) {
      logger.error(`indexParks() failed while retrieving photos: ${error}`);
      return;
    }

    for (const park of parkList) {
      logger.info(`indexing park ${park.orcs}`);
      if (await indexPark(park, photoList)) {
        indexed.push(taskId(queue, park.orcs));
      } else {
        logger.error(
          `error indexing park ${park.id} - ${park.protectedAreaName} ORCS=${park.orcs}`
        );
      }
    }
    try {
      await removeFromQueue(indexed);
    } catch (error) {
      logger.error(`Failed while removing queued 'elastic index park' tasks: ${error}`);
      return;
    }
  } while (indexed.length > 0 && !options?.id);

  // process items from the queue with the action 'elastic remove park'
  let removed;
  do {
    removed = [];
    try {
      queue = await readQueue("elastic remove park", options);
    } catch (error) {
      logger.error(`indexParks() failed while retrieving 'elastic remove park' tasks: ${error}`);
      return;
    }

    for (const task of queue) {
      const orcs = task.numericData;
      logger.info(`removing park ${task.numericData}`);
      if (await removePark(orcs)) {
        removed.push(taskId(queue, task.numericData));
      } else {
        logger.error(`error removing park ${orcs}`);
      }
    }
    try {
      await removeFromQueue(removed);
    } catch (error) {
      logger.error(`Failed while removing queued 'elastic remove park' tasks: ${error}`);
      return;
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
    await removePark(park.id);
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
};

/**
 *  Removes a single park from Elasticsearch
 */
const removePark = async function (orcs) {
  try {
    await elasticClient.removePark({ itemId: orcs });
  } catch (error) {
    getLogger().error(error);
    return false;
  }
  return true;
};

/**
 * Gets multiple parks from Strapi for indexing based
 * on an array of queuedTasks passed into the function
 */
const getBatch = async function (queuedTasks, options) {
  if (queuedTasks.length === 0) {
    return [];
  }
  const sort = options?.descending ? "id:DESC" : "id";
  const queueParkIds = queuedTasks.map((q) => +q.numericData);
  const parksFilters = qs.stringify(
    {
      filters: {
        orcs: {
          $in: queueParkIds,
        },
      },
      sort: sort,
    },
    {
      encodeValuesOnly: true,
    }
  );
  const parksQuery = `/api/search-indexing/parks?${parksFilters}`;
  const response = await cmsAxios.get(parksQuery);
  const parkList = response.data.data;
  getLogger().info(`Got ${parkList.length} protected areas from Strapi`);
  return parkList;
};

const getPhotos = async function (orcsList) {
  if (orcsList.length === 0) {
    return [];
  }
  const photoFilters = qs.stringify(
    {
      filters: {
        orcs: {
          $in: orcsList,
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );
  const photosQuery = `/api/search-indexing/photos?${photoFilters}`;
  const response = await cmsAxios.get(photosQuery);
  const photosList = response.data;
  getLogger().info(`Got ${photosList.length} park photo records from Strapi`);
  return photosList;
};

/**
 * Looks up the id of a queued task based on the associated park id
 */
const taskId = function (queue, parkId) {
  return queue.find((f) => f.numericData === parkId)?.documentId;
};
