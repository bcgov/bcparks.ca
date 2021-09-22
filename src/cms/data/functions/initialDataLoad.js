"use strict";

const permission = require("./loadPermissions");
const parData = require("./loadPar");
const otherData = require("./loadOtherData");
const publicAdvisoryAudit = require("./loadPublicAdvisoryAudit");
const parkPhoto = require("./loadParkPhoto");
const pageMedia = require("./loadPageMedia");

const isFirstRun = async () => {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: "type",
    name: "setup",
  });
  const initHasRun = await pluginStore.get({ key: "initHasRun" });
  await pluginStore.set({ key: "initHasRun", value: true });
  return !initHasRun;
};

const loadData = async () => {
  try {
    console.time('initialLoad')
    strapi.log.info("------Data load begins------");
    return Promise.all([
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
    ]).then(async () => {
      return Promise.all([
        parData.loadAdditionalParData(),
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
      ]).then(() => {
        strapi.log.info("------Data load completed------");
        console.timeEnd('initialLoad')
        return true;
      });
    });
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
    Promise.all([
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
    ]).then(() => {
      strapi.log.info("---------Removing all data completed---------");
      Promise.resolve(loadData()).then(() => {
        return true;
      });
    });
  } catch (error) {
    strapi.log.error(error);
  }
};

const seedData = async () => {
  // Load data and set default public roles on first run
  const setupCMS = await isFirstRun();
  if (setupCMS) {
    const isAdminCreated = await permission.createAdmin();
    const isTokenCreated = await permission.createApiToken();
    const isPermissionsSet = await permission.setDefaultPermissions();
    const isDataLoaded = await loadData();
    return isAdminCreated && isTokenCreated && isPermissionsSet && isDataLoaded;
  }
};

module.exports = {
  seedData,
};
