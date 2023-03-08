/*
 * Load initial data from the PAR API and then from local JSON files.
 */
const strapi = require("@strapi/strapi");

const loader = require("../data/functions/seedData.js");

strapi({ serveAdminPanel: false })
  .load()
  .then(async (app) => {
    try {
      await loader.seedData();
    } catch (err) {
      app.log.error(`Error occurred seeding initial data`);
      app.log.error(err);
      process.exit(1);
    }

    // Node recommends against calling process.exit()
    // but it is how strapi scripts do it ¯\_(ツ)_/¯
    process.exit(0);
  });
