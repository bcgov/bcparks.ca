/*
 * Load initial data for park operation objects from json
 */
const strapi = require("@strapi/strapi");

const operationDataLoad = require("../data/functions/loadOperationData.js");

strapi({ serveAdminPanel: false })
  .load()
  .then(async (app) => {
    try {
      console.log("-- Operation data loading script starting");
      const op = await operationDataLoad.loadData({
        isSeedMode: false,
        allowUpdates: true,
      });
      console.log("-- Operation data loading script complete");
    } catch (err) {
      app.log.error(`Error occurred loading operations data`);
      app.log.error(err);
      process.exit(1);
    }

    // Node recommends against calling process.exit()
    // but it is how strapi scripts do it ¯\_(ツ)_/¯
    process.exit(0);
  });
