/*
 * Refreshes the four park operation collections
 *   park-operation-sub-areas.json      => ParkOperationSubAreas
 *   park-operation-sub-area-types.json => ParkOperationSubAreaTypes
 *   park-operation.json                => ParkOperations
 *   park-operation-sub-area-dates.json => ParkOperationSubAreaDates
 */
const strapi = require("@strapi/strapi");

const loader = require("../data/functions/loadOperationData.js");

strapi({ serveAdminPanel: false })
  .load()
  .then(async (app) => {
    try {
      await loader.loadData({ isSeedMode: false, allowUpdates: true });
    } catch (err) {
      app.log.error(`Error occurred reimporting data`);
      app.log.error(err);
      process.exit(1);
    }

    // Node recommends against calling process.exit()
    // but it is how strapi scripts do it ¯\_(ツ)_/¯
    process.exit(0);
  });
