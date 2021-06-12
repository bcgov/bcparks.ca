"use strict";
const _ = require("lodash");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  // custom route for light weight park details used in client app
  async items() {
    const results = await strapi.query("protected-area").find({
      _limit: -1,
      _sort: "protectedAreaName",
      _populate: ["id", "orcs", "protectedAreaName"],
    });
    console.log(results);
    return results;
  },
};
