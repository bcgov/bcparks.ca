"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async items() {
    // custom route for lightweight park names used in client app
    const entities = await strapi.services["park-name"].items();
    return entities;
  },
};
