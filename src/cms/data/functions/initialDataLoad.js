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

const loadData = async () => {
  try {
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
      otherData.loadUrgency(),
      otherData.loadFireCentre(),
      otherData.loadFireZone(),
      otherData.loadFireCentreZoneXref(),
      otherData.loadFireBanProhibition(),
      publicAdvisory.loadPublicAdvisory(),
      otherData.loadParkActivity(),
      otherData.loadParkFacility(),
      otherData.loadParkFireZoneXref(),
      otherData.loadParkFogZoneXref(),
    ]);
  } catch (error) {
    strapi.log.error(error);
  }
};

const loadAdditionalData = async () => {
  try {
    await parData.loadAdditionalParData();
  } catch (error) {
    strapi.log.error(error);
  }
};

const seedData = async () => {
  // Load data and set default public roles on first run
  const setupCMS = await isFirstRun();
  // To be reverted
  if (true) {
    await permission.createAdmin();
    await permission.createApiToken();
    await permission.setDefaultPermissions();
    await loadData();
    await loadAdditionalData();
    strapi.log.info("------Data load completed------");
  }
};

module.exports = {
  seedData,
};
