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
    await parData.loadParData();
    await otherData.loadBusinessHours();
    await otherData.loadStatutoryHolidays();

    await otherData.loadAccessStatus();
    await otherData.loadAdvisoryStatus();
    await otherData.loadEventType();
    await otherData.loadLinkType();

    await otherData.loadActivityType();
    await otherData.loadFacilityType();
    await otherData.loadUrgency();

    await otherData.loadFireCentre();
    await otherData.loadFireZone();
    await otherData.loadFireCentreZoneXref();
    await otherData.loadFireBanProhibition();

    await publicAdvisory.loadPublicAdvisory();
    // comment out temporarily
    // await otherData.loadParkActivityXref();
    // await otherData.loadParkFacilityXref();
    await otherData.loadParkFireZoneXref();
    await otherData.loadParkFogZoneXref();
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
  if (setupCMS) {
    await permission.createAdmin();
    await permission.createApiToken();
    await permission.setDefaultPermissions();
    Promise.resolve(await loadData()).then(async () => {
      Promise.resolve(await loadAdditionalData()).then(() => {
        strapi.log.info("------Data load completed------");
      });
    });
  }
};

module.exports = {
  seedData,
};
