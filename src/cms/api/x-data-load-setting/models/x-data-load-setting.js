"use strict";
const reloadData = require("../../../data/functions/reloadData");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    afterUpdate(result) {
      const { loaderFunction } = result;
      reloadData.reloadData(loaderFunction);
    },
  },
};
