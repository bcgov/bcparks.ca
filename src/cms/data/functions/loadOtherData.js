"use strict";
const axios = require("axios");
const fs = require("fs");
const loadUtils = require("./loadUtils");

const loadAccessStatus = async () => {
  loadUtils.loadJson(
    "access-status",
    "./data/access-status.json",
    "access-status"
  );
};

const loadActivityType = async () => {
  loadUtils.loadJson(
    "activity-type",
    "./data/park-activity.json",
    "park-activity"
  );
};

const loadAdvisoryStatus = async () => {
  loadUtils.loadJson(
    "advisory-status",
    "./data/advisory-status.json",
    "advisory-status"
  );
};

const loadAssetType = async () => {
  console.log("loadAssetType");
};

const loadEventType = async () => {
  loadUtils.loadJson("event-type", "./data/event-type.json", "event-type");
};

const loadLinkType = async () => {
  loadUtils.loadJson("link-type", "./data/link-type.json", "link-type");
};

const loadFacilityType = async () => {
  loadUtils.loadJson(
    "facility-type",
    "./data/park-facility.json",
    "park-facility"
  );
};

const loadFireCentre = async () => {
  loadUtils.loadJson("fire-centre", "./data/fire-centre.json", "fire-centre");
};

const loadFireZone = async () => {
  loadUtils.loadJson("fire-zone", "./data/fire-zone.json", "fire-zone");
};

const loadFireBanProhibition = async () => {
  const WILDFIRE_BANS_PROHIBITIONS_API_ENDPOINT =
    "https://services6.arcgis.com/ubm4tcTYICKBpist/arcgis/rest/services/British_Columbia_Bans_and_Prohibition_Areas/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields";

  strapi.log.info("Loading Fire Bans and Prohibitions data..");
  await strapi.services["fire-ban-prohibition"].delete();

  axios
    .get(WILDFIRE_BANS_PROHIBITIONS_API_ENDPOINT)
    .then(async (response) => {
      const { features } = response.data;
      if (!features) return;
      features.forEach(async (feature) => {
        const {
          attributes: {
            TYPE: type,
            ACCESS_PROHIBITION_DESCRIPTION: access_prohibition_description,
            ACCESS_STATUS_EFFECTIVE_DATE: access_status_effective_date,
            BULLETIN_URL: bulletin_url,
            FIRE_CENTRE_NAME: fire_centre_name,
            FIRE_ZONE_NAME: fire_zone_name,
          },
        } = feature;

        let fireCentre = null;
        if (fire_centre_name) {
          fireCentre = await strapi.services["fire-centre"].findOne({
            fireCentreName_contains: fire_centre_name,
          });
        }

        let fireZone = null;
        if (fire_zone_name) {
          fireZone = await strapi.services["fire-zone"].findOne({
            fireZoneName_contains: fire_zone_name,
          });
        }

        const prohibition = {
          type: type,
          prohibitionDescription: access_prohibition_description,
          effectiveDate: access_status_effective_date,
          bulletinURL: bulletin_url,
          fireCentreSource: fire_centre_name,
          fireCentre: fireCentre,
          fireZone: fireZone,
        };

        await strapi.services["fire-ban-prohibition"].create(prohibition);
      });
    })
    .catch((error) => {
      strapi.log.error(error);
    });
};

const loadStandardMessage = async () => {
  loadUtils.loadJson(
    "standard-message",
    "./data/standard-message.json",
    "standard-message"
  );
};

const loadUrgency = async () => {
  loadUtils.loadJson("urgency", "./data/urgency.json", "urgency");
};

// xref
const loadFireCentreZoneXref = async () => {
  strapi.log.info("loading fire center -> zone xref...");
  var jsonData = fs.readFileSync("./data/fire-zone.json", "utf8");
  const dataSeed = JSON.parse(jsonData)["fire-zone"];

  const fireZoneXref = Object.entries(
    dataSeed.reduce((acc, { fireCentreNumber, fireZoneNumber }) => {
      acc[fireCentreNumber] = [
        ...(acc[fireCentreNumber] || []),
        { fireZoneNumber },
      ];
      return acc;
    }, {})
  ).map(([key, value]) => ({ fireCentreNumber: key, fireZoneNumber: value }));

  for (const xref of fireZoneXref) {
    const fireCentre = await strapi.services["fire-centre"].findOne({
      fireCentreNumber: xref.fireCentreNumber,
    });
    if (fireCentre) {
      let fireZones = [];
      for (const item of xref.fireZoneNumber) {
        const fireZone = await strapi.services["fire-zone"].findOne({
          fireZoneNumber: item.fireZoneNumber,
        });
        fireZones = [...fireZones, fireZone];
      }

      if (fireZones.length > 0) {
        fireCentre.fireZones = fireZones;
        await strapi
          .query("fire-centre")
          .update({ id: fireCentre.id }, fireCentre);
      }
    }
  }
  strapi.log.info("loading fire center -> zone xref completed...");
};

const loadParkActivity = async () => {
  const modelName = "park-activity";
  const loadSetting = await loadUtils.getLoadSettings(modelName);

  if (loadSetting && loadSetting.purge)
    await strapi.services[modelName].delete();

  if (loadSetting && !loadSetting.reload) return;

  const currentData = await strapi.services[modelName].find();
  if (currentData.length === 0) {
    try {
      strapi.log.info("loading park activity...");
      var jsonData = fs.readFileSync("./data/park-activity-xref.json", "utf8");
      const parkActivityData = JSON.parse(jsonData)["parkActivity"];

      for await (const activity of parkActivityData) {
        const protectedArea = await strapi.services["protected-area"].findOne({
          orcs: activity.orcs,
        });
        const protectedAreaId = protectedArea ? protectedArea.id : null;

        let site;
        if (!isNaN(activity.orcsSiteNumber)) {
          site = await strapi.services["site"].findOne({
            siteNumber: activity.orcsSiteNumber,
          });
        }
        const siteId = site ? site.id : null;

        if (!activity.activityNumber) continue;

        const activityType = await strapi.services["activity-type"].findOne({
          activityNumber: activity.activityNumber,
        });
        const activityTypeId = activityType ? activityType.id : null;

        const parkActivity = {
          protectedArea: protectedAreaId,
          site: siteId,
          activityType: activityTypeId,
          description: activity.description,
          isActivityOpen: activity.isActivityOpen,
          isActive: activity.isActive,
        };
        await strapi.services["park-activity"]
          .create(parkActivity)
          .catch((error) => {
            strapi.log.error(
              `error creating park-activity ${parkActivity.activityNumber}...`,
              error,
              parkActivity
            );
          });
      }
    } catch (error) {
      strapi.log.error(error);
    }
    strapi.log.info("loading park activity completed...");
  }
};

const loadParkFacility = async () => {
  const modelName = "park-facility";
  const loadSetting = await loadUtils.getLoadSettings(modelName);

  if (loadSetting && loadSetting.purge)
    await strapi.services[modelName].delete();

  if (loadSetting && !loadSetting.reload) return;

  const currentData = await strapi.services[modelName].find();
  if (currentData.length === 0) {
    try {
      strapi.log.info("loading park facility...");
      var jsonData = fs.readFileSync("./data/park-facility-xref.json", "utf8");
      const parkFacilityData = JSON.parse(jsonData)["parkFacility"];

      for await (const facility of parkFacilityData) {
        const protectedArea = await strapi.services["protected-area"].findOne({
          orcs: facility.orcs,
        });
        const protectedAreaId = protectedArea ? protectedArea.id : null;

        let site;
        if (!isNaN(facility.orcsSiteNumber)) {
          site = await strapi.services["site"].findOne({
            siteNumber: facility.orcsSiteNumber,
          });
        }
        const siteId = site ? site.id : null;

        if (!facility.facilityNumber) continue;

        const facilityType = await strapi.services["facility-type"].findOne({
          facilityNumber: facility.facilityNumber,
        });
        const facilityTypeId = facilityType ? facilityType.id : null;

        const parkFacility = {
          protectedArea: protectedAreaId,
          site: siteId,
          facilityType: facilityTypeId,
          description: facility.description,
          isFacilityOpen: facility.isFacilityOpen,
          isActive: facility.isActive,
        };
        await strapi.services["park-facility"]
          .create(parkFacility)
          .catch((error) => {
            strapi.log.error(
              `error creating park-facility ${parkFacility.facilityNumber}...`,
              error,
              parkFacility
            );
          });
      }
    } catch (error) {
      strapi.log.error(error);
    }
    strapi.log.info("loading park facility completed...");
  }
};

const loadParkName = async () => {
  const modelName = "park-name";
  const loadSetting = await loadUtils.getLoadSettings(modelName);

  if (loadSetting && loadSetting.purge)
    await strapi.services[modelName].delete();

  if (loadSetting && !loadSetting.reload) return;

  const currentData = await strapi.services[modelName].find();
  if (currentData.length === 0) {
    strapi.log.info("loading park name...");
    var jsonData = fs.readFileSync("./data/park-name.json", "utf8");
    const dataSeed = JSON.parse(jsonData)["park-name"];

    for await (const data of dataSeed) {
      const protectedArea = await strapi.services["protected-area"].findOne({
        orcs: data.orcs,
      });
      const protectedAreaId = protectedArea ? protectedArea.id : null;

      const parkNameType = await strapi.services["park-name-type"].findOne({
        nameTypeId: data.nameTypeId,
      });
      const parkNameTypeId = parkNameType ? parkNameType.id : null;

      const parkName = {
        parkName: data.parkName,
        source: data.source,
        note: data.note,
        protectedArea: protectedAreaId,
        parkNameType: parkNameTypeId,
      };
      await strapi.services["park-name"].create(parkName);
    }
    strapi.log.info("loading park name completed...");
  }
};

const loadParkNameType = async () => {
  loadUtils.loadJson(
    "park-name-type",
    "./data/park-name-type.json",
    "park-name-type"
  );
};

const loadParkFireZoneXref = async () => {
  strapi.log.info("loading park fire zone xref...");
  var jsonData = fs.readFileSync("./data/park-fire-zone-xref.json", "utf8");
  const dataSeed = JSON.parse(jsonData)["park-fire-zone-xref"];

  const parkFireZoneXref = Object.entries(
    dataSeed.reduce((acc, { orcs, fireZoneNumber }) => {
      acc[orcs] = [...(acc[orcs] || []), { fireZoneNumber }];
      return acc;
    }, {})
  ).map(([key, value]) => ({ orcs: key, fireZoneNumber: value }));

  for (const parkXref of parkFireZoneXref) {
    const protectedArea = await strapi.services["protected-area"].findOne({
      orcs: parkXref.orcs,
    });
    if (protectedArea) {
      let fireZones = [];
      for (const item of parkXref.fireZoneNumber) {
        const fireZone = await strapi.services["fire-zone"].findOne({
          fireZoneNumber: item.fireZoneNumber,
        });
        fireZones = [...fireZones, fireZone];
      }

      if (fireZones.length > 0) {
        protectedArea.fireZones = fireZones;
        await strapi
          .query("protected-area")
          .update({ id: protectedArea.id }, protectedArea);
      }
    }
  }
};

const loadParkFogZoneXref = async () => {
  strapi.log.info("loading park fog zone xref...");
  var jsonData = fs.readFileSync("./data/park-fog-zone-xref.json", "utf8");
  const dataSeed = JSON.parse(jsonData)["park-fog-zone-xref"];
  for (const data of dataSeed) {
    const protectedArea = await strapi.services["protected-area"].findOne({
      orcs: data.orcs,
    });
    if (protectedArea) {
      protectedArea.isFogZone = data.fogZone === "Y" ? true : false;

      await strapi
        .query("protected-area")
        .update({ id: protectedArea.id }, protectedArea);
    }
  }
};

// dates and holidays
const loadBusinessHours = async () => {
  strapi.log.info("Loading Business hours..");
  try {
    var jsonData = fs.readFileSync("./data/business-hours.json", "utf8");
    const data = JSON.parse(jsonData);
    await strapi.services["business-hours"].createOrUpdate(data);
  } catch (error) {
    strapi.log.error(error);
  }
};

const loadStatutoryHolidays = async () => {
  try {
    strapi.log.info("Setting Empty Statutory Holidays..");
    await strapi.services["statutory-holidays"].createOrUpdate("{}");
  } catch (error) {
    strapi.log.error(error);
  }
};

const loadWebsites = async () => {
  loadUtils.loadJson("website", "./data/websites.json", "website");
};

const loadPages = async () => {
  loadUtils.loadJson("page", "./data/pages.json", "page");
};

const loadMenus = async () => {
  const model = "menu"
  const object = "menu"
  try {
    const currentData = await strapi.services[model].find();

    if (currentData.length == 0) {
      strapi.log.info(`loading ${model} started...`);
      var jsonData = fs.readFileSync("./data/menus.json", "utf8");
      const dataSeed = JSON.parse(jsonData)[object];

      // Add all records first without parent child reference
      for await(const data of dataSeed) {
        const menu = { ...data }
        const keys = Object.keys(menu);
        for (let i = 0; i < keys.length; i++) {
          if (menu[keys[i]] === "") menu[keys[i]] = null;
        }
        if (menu.children) delete menu.children
        if (menu.parent) delete menu.parent
        await strapi.services[model].create(menu);
      }
      strapi.log.info(`loading ${model} without references completed...`);

      // Loop through new records and update parent/child references
      for await(const menu of dataSeed) {
        if (menu.parent) {
          const current = await strapi.services[model].findOne({ title: menu.title })
          const parent = await strapi.services[model].findOne({ title: menu?.parent })
          if (!current?.parent && parent) {
            current.parent = parent.id
            await strapi.query("menu").update({ id: current.id }, current)
          }
        }
      }
      strapi.log.info(`updating ${model} with references completed...`);
      strapi.log.info(`loading ${model} completed...`);
    }
  } catch (error) {
    strapi.log.error(`error loading ${model}...`);
    strapi.log.error(error);
  }
};

module.exports = {
  loadBusinessHours,
  loadStatutoryHolidays,
  loadAccessStatus,
  loadActivityType,
  loadAdvisoryStatus,
  loadAssetType,
  loadEventType,
  loadLinkType,
  loadFacilityType,
  loadFireCentre,
  loadFireZone,
  loadFireCentreZoneXref,
  loadFireBanProhibition,
  loadStandardMessage,
  loadUrgency,
  loadParkActivity,
  loadParkFacility,
  loadParkNameType,
  loadParkName,
  loadParkFireZoneXref,
  loadParkFogZoneXref,
  loadPages,
  loadWebsites,
  loadMenus,
};
