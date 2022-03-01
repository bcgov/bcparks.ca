"use strict";
const dbsetup = require("./dbsetup");
const permission = require("../../data/functions/loadPermissions");

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
  await dbsetup();

  // make sure all content types that should have public read permissions
  const p = await permission.setPublicPermissions();
  console.log("Public permisisons for content-types set:", p)
};
