"use strict";

const permission = require("./loadPermissions");
const parData = require("./loadPar");
const otherData = require("./loadOtherData");
const operationData = require("./loadOperationData");
const publicAdvisoryAudit = require("./loadPublicAdvisoryAudit");
const parkPhoto = require("./loadParkPhoto");
const parkSubpage = require("./loadParkSubpages");
const pageMedia = require("./loadPageMedia");

const loadData = async () => {
  try {
    console.time("initialLoad");
    strapi.log.info("------Data load begins------");
    await Promise.all([
      parData.loadParData(),
      otherData.loadBusinessHours(),
      otherData.loadStatutoryHolidays(),
      otherData.loadAccessStatus(),
      otherData.loadAdvisoryStatus(),
      otherData.loadEventType(),
      otherData.loadLinkType(),
      otherData.loadActivityType(),
      otherData.loadFacilityType(),
      otherData.loadParkNameType(),
      otherData.loadStandardMessage(),
      otherData.loadUrgency(),
      otherData.loadFireCentre(),
      otherData.loadFireZone(),
    ]);

    // this is run on its own because sites need to be imported after 
    // protectedAreas and before parkActivities and parkFacilities
    await parData.loadAdditionalParData();    

    await Promise.all([
      otherData.loadFireCentreZoneXref(),
      otherData.loadParkFireZoneXref(),
      otherData.loadFireBanProhibition(),
      otherData.loadParkFogZoneXref(),
      otherData.loadParkActivity(),
      otherData.loadParkFacility(),
      otherData.loadParkName(),
      otherData.loadMenus(),
      publicAdvisoryAudit.loadPublicAdvisoryAudit(),
      pageMedia.loadPageMedia(),
      parkPhoto.loadParkPhoto(),
      parkSubpage.loadParkSubpages(),
    ]);

    await operationData.loadData({isSeedMode: true});

    strapi.log.info("------Data load completed------");
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
    strapi.log.info("---------Removing all data---------");
    await Promise.all([
      strapi.services["park-sub-page"].delete(),
      strapi.services["protected-area"].delete(),
      strapi.services["section"].delete(),
      strapi.services["management-area"].delete(),
      strapi.services["region"].delete(),
      strapi.services["site"].delete(),
      strapi.services["public-advisory"].delete(),
      strapi.services["access-status"].delete(),
      strapi.services["event-type"].delete(),
      strapi.services["fire-ban-prohibition"].delete(),
      strapi.services["fire-centre"].delete(),
      strapi.services["fire-zone"].delete(),
      strapi.services["activity-type"].delete(),
      strapi.services["park-activity"].delete(),
      strapi.services["facility-type"].delete(),
      strapi.services["park-facility"].delete(),
      strapi.services["park-name-type"].delete(),
      strapi.services["park-name"].delete(),
      strapi.services["advisory-status"].delete(),
      strapi.services["link-type"].delete(),
      strapi.services["urgency"].delete(),
      strapi.services["website"].delete(),
      strapi.services["page"].delete(),
      strapi.services["menu"].delete(),
    ])
    
    strapi.log.info("---------Removing all data completed---------");
    await loadData();
  } catch (error) {
    strapi.log.error(error);
  }
};

const seedData = async () => {
  const isAdminCreated = await permission.createAdmin();
  const isTokenCreated = await permission.createApiToken();
  const isPermissionsSet = await permission.setDefaultPermissions();
  const isDataLoaded = await loadData();
  return isAdminCreated && isTokenCreated && isPermissionsSet && isDataLoaded;
};

module.exports = {
  seedData,
};
