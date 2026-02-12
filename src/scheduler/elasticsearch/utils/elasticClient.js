const { Client } = require("@opensearch-project/opensearch");

let client = null;

/**
 * Connects to opensearch and sets up the client
 */
function initializeESClient() {
  let authConfig = {};
  if (process.env.ELASTIC_USERNAME) {
    authConfig = {
      auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
      },
    };
  }
  try {
    client = new Client({
      node: process.env.ELASTIC_HOST,
      ...authConfig,
    });
  } catch (err) {
    console.log("Error while initializing the connection to ElasticSearch.");
    console.log(err);
  }
}

/**
 * Creates a new Elasticsearch park index
 */
async function createParkIndex(config) {
  try {
    await client.indices.create({
      index: parkIndexName(),
      body: config,
    });
    await client.indices.refresh({
      index: parkIndexName(),
    });
  } catch (err) {
    console.log("Error encountered while creating the park index.");
    throw err;
  }
}

/**
 * Deletes the Elasticsearch park index
 */
async function deleteParkIndex() {
  await client.indices.delete({ index: parkIndexName() });
}

/**
 * Adds a park to the Elasticsearch park index
 */
async function indexPark({ itemId, document }) {
  try {
    await client.index({
      index: parkIndexName(),
      id: itemId,
      body: document,
    });

    await client.indices.refresh({
      index: parkIndexName(),
    });
  } catch (err) {
    console.log("Error encountered while sending data to ElasticSearch.");
    throw err;
  }
}

/**
 * Removes a park from the Elasticsearch park index
 */
async function removePark({ itemId }) {
  try {
    await client.delete({
      id: itemId,
      index: parkIndexName(),
    });
    await client.indices.refresh({
      index: parkIndexName(),
    });
  } catch (err) {
    if (!JSON.stringify(err).includes("not_found")) {
      console.log(
        `Error encountered while removing indexed data from ElasticSearch.\n${JSON.stringify(err)}`
      );
      throw err;
    }
  }
}

/**
 * Checks if the park index exists
 */
async function parkIndexExists() {
  try {
    const result = await client.indices.exists({
      index: parkIndexName(),
    });
    return result.statusCode === 200;
  } catch (err) {
    console.log("Error encountered while checking if index exists in ElasticSearch.");
  }
  return false;
}

/**
 * Gets the park index name based on the BCPARKS_ENVIRONMENT environment variable
 */
const parkIndexName = () => {
  return `${process.env.ELASTIC_PARK_INDEX_NAME}-${process.env.BCPARKS_ENVIRONMENT || "local"}`;
};

module.exports = {
  createParkIndex,
  deleteParkIndex,
  indexPark,
  initializeESClient,
  parkIndexExists,
  removePark,
};
