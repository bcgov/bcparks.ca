"use strict";

const permission = require("./loadPermissions");
const parData = require("./loadPAR");
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
    await parData.loadParData();
    await otherData.loadBusinessHours();
    await otherData.loadStatutoryHolidays();

    await otherData.loadAccessStatus();
    await otherData.loadAdvisoryStatus();
    await otherData.loadEventType();
    await otherData.loadLinkType();

    await otherData.loadActivity();
    await otherData.loadFacility();
    await otherData.loadUrgency();

    await otherData.loadFireCentre();
    await otherData.loadFireZone();
    await otherData.loadFireCentreZoneXref();
    await otherData.loadFireBanProhibition();

    await publicAdvisory.loadPublicAdvisory();
    await otherData.loadParkActivityXref();
    await otherData.loadParkFacilityXref();
    await otherData.loadParkFireZoneXref();
    await otherData.loadParkFogZoneXref();
  } catch (error) {
    strapi.log.error(error);
  }
};

const seedData = async () => {
  // Load data and set default public roles on first run
  const setupCMS = await isFirstRun();
  if (setupCMS) {
    await permission.createAdmin();
    await permission.setDefaultPermissions();
    await loadData();
  }
  //To be removed in next commit
  await parData.loadParData();
};

module.exports = {
  seedData,
};
