"use strict";
const createSearchIndexes = require("../../data/functions/createSearchIndexes");
const initialDataLoad = require("../../data/functions/initialDataLoad");

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#bootstrap
 */

module.exports = async () => {
  // Setup text indexes for search
  await createSearchIndexes();

  // Load seed data first run
  await initialDataLoad.seedData();
};
