// This is an example of a script that updates all the protected-area 
// records in strapi. To run it go to the /src/cms folder and run:
// node scripts/publish-all.js
//

"use strict";

const strapi = require("strapi")({ serveAdminPanel: false });

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

        // reset the reconcilliationNotes for all parks to the value from legacy
        reconciliationNotes: `<p>
  BC Parks is committed to reconciliation with Indigenous peoples. Although this webpage may not adequately represent the history and relationship of Indigenous peoples to this area, we are working in partnership with First Nations to update this information and better reflect these deep connections to the land. To learn about Indigenous territories in BC, see the <a href=\"https://maps.fpcc.ca/\">First Peoples’ Language Map</a> which also shows the locations of all BC Parks.
</p>`,
        // you can add more properties to update here
      }
    );
    strapi.log.info("published orcs " + protectedArea.orcs);
  }
  strapi.log.info("update protected areas completed...");
};
