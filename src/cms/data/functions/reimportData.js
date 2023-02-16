"use strict";

const parData = require("./loadPar");
const otherData = require("./loadOtherData");
const operationData = require("./loadOperationData");
const parkSubpage = require("./loadParkSubpages");

const loadData = async () => {
  try {
    console.time("initialLoad");
    strapi.log.info("------Data reload begins------");
    await Promise.all([
      parData.loadParData(),
      otherData.loadActivityType(),
      otherData.loadFacilityType(),
    ]);

    // this is run on its own because sites need to be imported after 
    // protectedAreas and before parkActivities and parkFacilities
    await parData.loadAdditionalParData();

    await Promise.all([
      otherData.loadParkFireZoneXref(),
      otherData.loadParkFogZoneXref(),
      otherData.loadParkActivity(),
      otherData.loadParkFacility(),
      otherData.loadParkName(),
      parkSubpage.loadParkSubpages(),
    ]);

    await operationData.loadData({ isSeedMode: false, allowUpdates: true });

    strapi.log.info("------Data reload completed------");
    console.timeEnd("initialLoad");
  } catch (error) {
    strapi.log.error(error);
    return false;
  }
};

/**
 * *********** This method is only for testing purposes **************
 */
const rewriteData = async () => {
  try {
    strapi.log.info("---------Removing data requiring reload---------");
    await Promise.all([
      strapi.services["park-sub-page"].delete(),
      strapi.services["site"].delete(),
      strapi.services["activity-type"].delete(),
      strapi.services["park-activity"].delete(),
      strapi.services["facility-type"].delete(),
      strapi.services["park-facility"].delete(),
      strapi.services["park-name"].delete(),
    ]);

    strapi.log.info("---------Finished removing data requiring reload---------");
    await loadData();
    return true;
  } catch (error) {
    strapi.log.error(error);
  }
};

const reimport = async () => {
  return await rewriteData();
};

module.exports = {
  reimport,
};
