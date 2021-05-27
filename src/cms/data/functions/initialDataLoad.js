"use strict";

const permission = require("./loadPermissions");
const parData = require("./loadPar");
const otherData = require("./loadOtherData");
const publicAdvisory = require("./loadPublicAdvisory");

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

const loadData = () => {
  try {
    strapi.log.info("------Data load begins------");
    Promise.all([
      parData.loadParData(),
      otherData.loadBusinessHours(),
      otherData.loadStatutoryHolidays(),
      otherData.loadAccessStatus(),
      otherData.loadAdvisoryStatus(),
      otherData.loadEventType(),
      otherData.loadLinkType(),
      otherData.loadActivityType(),
      otherData.loadFacilityType(),
      otherData.loadUrgency(),
      otherData.loadFireCentre(),
      otherData.loadFireZone(),
      otherData.loadFireBanProhibition(),
      publicAdvisory.loadPublicAdvisory(),
    ]).then(() => {
      Promise.all([
        otherData.loadFireCentreZoneXref(),
        otherData.loadParkFireZoneXref(),
        otherData.loadParkFogZoneXref(),
        otherData.loadParkActivity(),
        otherData.loadParkFacility(),
        parData.loadAdditionalParData(),
      ]).then(() => {
        strapi.log.info("------Data load completed------");
      });
    });
  } catch (error) {
    strapi.log.error(error);
  }
};

const rewriteData = () => {
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
      strapi.services["advisory-status"].delete(),
      strapi.services["link-type"].delete(),
      strapi.services["urgency"].delete(),
    ]).then(() => {
      loadData();
    });
  } catch (error) {
    strapi.log.error(error);
  }
};

const seedData = async () => {
  // Load data and set default public roles on first run
  const setupCMS = await isFirstRun();
  if (setupCMS) {
    await permission.createAdmin();
    await permission.createApiToken();
    await permission.setDefaultPermissions();
    loadData();
  }
  rewriteData();
};

module.exports = {
  seedData,
};
