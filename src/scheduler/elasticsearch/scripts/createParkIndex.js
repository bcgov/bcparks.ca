const { getLogger } = require("../../shared/logging");
const elasticClient = require("../utils/elasticClient");

/**
 * Creates a new park index in Elasticsearch.
 * Only fields with special settings need to be included in these mappings.
 */
const createParkIndex = async function () {
  elasticClient.initializeESClient();
  const logger = getLogger();

  const config = {
    settings: {
      index: {
        analysis: {
          analyzer: {
            parkname_analyzer: {
              tokenizer: "icu_tokenizer",
              filter: ["icu_folding", "lowercase"],
            },
          },
        },
      },
    },
    mappings: {
      properties: {
        protectedAreaName: {
          type: "text",
          analyzer: "parkname_analyzer",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        nameLowerCase: {
          type: "text",
          analyzer: "parkname_analyzer",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        parkNames: {
          type: "text",
          analyzer: "parkname_analyzer",
          fields: {
            keyword: {
              type: "keyword",
              ignore_above: 256,
            },
          },
        },
        location: {
          type: "geo_point",
        },
        geoBoundary: {
          // this is a work-around because you can't sort by distance to a shape in Elasticsearch
          type: "geo_point",
        },
      },
    },
  };

  try {
    await elasticClient.createParkIndex(config);
  } catch (error) {
    logger.error(`createParkIndex() failed: ${error}`);
    return;
  }

  logger.info("Created the park index");
};

/**
 * Checks if the park index exists
 */
const parkIndexExists = async function () {
  elasticClient.initializeESClient();
  return await elasticClient.parkIndexExists();
};

module.exports = {
  createParkIndex,
  parkIndexExists,
};
