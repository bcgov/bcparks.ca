"use strict";
const createSearchIndexes = require("../../data/functions/createSearchIndexes");

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
  // Skip the bootstrap for unit tests for now.
  // Will need to create unit test specific bootstrapping later.
  if (process.env.NODE_ENV !== "test") {
    // Setup text indexes for search
    await createSearchIndexes();
  }
};
