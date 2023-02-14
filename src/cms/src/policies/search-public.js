"use strict";

/**
 * `search-public` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In search-public policy.");

  await next();
};
