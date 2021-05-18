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

const loadActivity = async () => {
  loadUtils.loadJson("activity", "./data/park-activity.json", "park-activity");
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

const loadFacility = async () => {
  loadUtils.loadJson("facility", "./data/park-facility.json", "park-facility");
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
    .then((response) => {
      const { features } = response.data;
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
          fireCentre: fireCentre,
          fireZone: fireZone,
        };

        strapi.services["fire-ban-prohibition"].create(prohibition);
      });
    })
    .catch((error) => {
      strapi.log.error(error);
    });
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
        strapi.query("fire-centre").update({ id: fireCentre.id }, fireCentre);
      }
    }
  }
  strapi.log.info("loading fire center -> zone xref completed...");
};

const loadParkActivityXref = async () => {
  strapi.log.info("loading park activity xref...");
  var jsonData = fs.readFileSync("./data/park-activity-xref.json", "utf8");
  const dataSeed = JSON.parse(jsonData)["park-activity-xref"];

  const xrefs = Object.entries(
    dataSeed.reduce((acc, { orcs, activityId }) => {
      acc[orcs] = [...(acc[orcs] || []), { activityId }];
      return acc;
    }, {})
  ).map(([key, value]) => ({ orcs: key, activityId: value }));

  for (const xref of xrefs) {
    const protectedArea = await strapi.services["protected-area"].findOne({
      orcs: xref.orcs,
    });
    if (protectedArea) {
      let activities = [];
      for (const item of xref.activityId) {
        const activity = await strapi.services["activity"].findOne({
          activityNumber: item.activityId,
        });
        activities = [...activities, activity];
      }

      if (activities.length > 0) {
        protectedArea.Activities = activities;
        strapi
          .query("protected-area")
          .update({ id: protectedArea.id }, protectedArea);
      }
    }
  }
};

const loadParkFacilityXref = async () => {
  strapi.log.info("loading park facility xref...");
  var jsonData = fs.readFileSync("./data/park-facility-xref.json", "utf8");
  const dataSeed = JSON.parse(jsonData)["park-facility-xref"];

  const xrefs = Object.entries(
    dataSeed.reduce((acc, { orcs, facilityId }) => {
      acc[orcs] = [...(acc[orcs] || []), { facilityId }];
      return acc;
    }, {})
  ).map(([key, value]) => ({ orcs: key, facilityId: value }));

  for (const xref of xrefs) {
    const protectedArea = await strapi.services["protected-area"].findOne({
      orcs: xref.orcs,
    });
    if (protectedArea) {
      let facilities = [];
      for (const item of xref.facilityId) {
        const facility = await strapi.services["facility"].findOne({
          facilityNumber: item.facilityId,
        });
        facilities = [...facilities, facility];
      }

      if (facilities.length > 0) {
        protectedArea.facilities = facilities;
        strapi
          .query("protected-area")
          .update({ id: protectedArea.id }, protectedArea);
      }
    }
  }
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
        protectedArea.FireZones = fireZones;
        strapi
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

      strapi
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
    strapi.services["business-hours"].createOrUpdate(data);
  } catch (error) {
    strapi.log.error(error);
  }
};

const loadStatutoryHolidays = async () => {
  try {
    strapi.log.info("Setting Empty Statutory Holidays..");
    strapi.services["statutory-holidays"].createOrUpdate("{}");
  } catch (error) {
    strapi.log.error(error);
  }
};

module.exports = {
  loadBusinessHours,
  loadStatutoryHolidays,
  loadAccessStatus,
  loadActivity,
  loadAdvisoryStatus,
  loadAssetType,
  loadEventType,
  loadLinkType,
  loadFacility,
  loadFireCentre,
  loadFireZone,
  loadFireCentreZoneXref,
  loadFireBanProhibition,
  loadUrgency,
  loadParkActivityXref,
  loadParkFacilityXref,
  loadParkFireZoneXref,
  loadParkFogZoneXref,
};
