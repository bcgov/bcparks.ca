// This is an example of a script that updates all the protected-area 
// records in strapi. To run it go to the /src/cms folder and run:
// node scripts/publish-all.js
//

"use strict";

const strapi = require("@strapi/strapi")({ serveAdminPanel: false });

strapi.load().then(async (app) => {
  try {
    await publishAll();
  } catch (err) {
    app.log.error(`Error occurred running script`);
    app.log.error(err);
    process.exit(1);
  }
  process.exit(0);
});

// sets all parks to be displayed
const publishAll = async () => {
  strapi.log.info("update protected areas started...");
  const protectedAreas = await strapi.services["protected-area"].find({
    _limit: -1,
  });
  for (const protectedArea of protectedAreas) {
    await strapi.services["protected-area"].update(
      { 
        // this identifies which row to update
        id: protectedArea.id 
      }, 
      {
        // these are the properties being updated

        // display all parks
        isDisplayed: true,
        // you can add more properties to update here
      }
    );
    strapi.log.info("published orcs " + protectedArea.orcs);
  }
  strapi.log.info("update protected areas completed...");
};
