"use strict";
const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const loadUtils = require("./loadUtils");

const loadPublicAdvisory = async () => {
  try {
    const modelName = "public-advisory";
    const loadSetting = await loadUtils.getLoadSettings(modelName);

    if (loadSetting && loadSetting.purge)
      await strapi.services[modelName].delete();

    if (loadSetting && !loadSetting.reload) return;

    const currentData = await strapi.services[modelName].find();
    if (currentData.length === 0) {
      strapi.log.info(`loading ${modelName}...`);

      const accessStatuses = await strapi.query("access-status").find();
      const advisoryStatuses = await strapi.query("advisory-status").find();
      const eventTypes = await strapi.query("event-type").find();
      const urgencies = await strapi.query("urgency").find();

      var jsonData = fs.readFileSync("./data/public-advisory.json", "utf8");
      const dataSeed = JSON.parse(jsonData)[modelName];

      var jsonData = fs.readFileSync(
        "./data/public-advisory-xref.json",
        "utf8"
      );
      const dataXref = JSON.parse(jsonData);

      dataSeed.map(async (data) => {
        const orcsXref = await dataXref["public-advisory-xref"].filter(
          (x) => x.AdvisoryNumber == data.AdvisoryNumber
        );

        let orcs = [];
        await Promise.all(
          orcsXref.map(async (o) => {
            const orc = await strapi
              .query("protected-area")
              .find({ ORCS: o.ORCS });
            orcs = [...orcs, ...orc];
          })
        );
        data.ProtectedAreas = orcs;

        data.AccessStatus = accessStatuses.find(
          (d) => d.AccessStatus === data.AccessStatus
        );
        data.AdvisoryStatus = advisoryStatuses.find(
          (d) => d.AdvisoryStatus === data.AdvisoryStatus
        );
        data.EventType = eventTypes.find((d) => d.EventType === data.EventType);
        data.Urgency = urgencies.find((d) => d.Urgency === data.Urgency);

        data.DCTicketNumber = +data.DCTicketNumber;
        data.ListingRank = +data.ListingRank;
        data.Latitude = +data.Latitude;
        data.Longitude = +data.Longitude;
        data.MapZoom = +data.MapZoom;
        data.AdvisoryDate = loadUtils.formatDate(data.AdvisoryDate);
        data.EffectiveDate = loadUtils.formatDate(data.EffectiveDate);
        data.EndDate = loadUtils.formatDate(data.EndDate);
        data.ExpiryDate = loadUtils.formatDate(data.ExpiryDate);
        data.RemovalDate = loadUtils.formatDate(data.RemovalDate);
        data.UpdatedDate = loadUtils.formatDate(data.UpdatedDate);
        data.CreatedDate = loadUtils.formatDate(data.CreatedDate);
        data.ModifiedDate = loadUtils.formatDate(data.ModifiedDate);
        await strapi.services[modelName].create(data);
      });
      strapi.log.info(`loading completed ${modelName}...`);
    }
  } catch (error) {
    strapi.log.error(error);
  }
};

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
            TYPE,
            ACCESS_PROHIBITION_DESCRIPTION,
            ACCESS_STATUS_EFFECTIVE_DATE,
            BULLETIN_URL,
            FIRE_CENTRE_NAME,
            FIRE_ZONE_NAME,
          },
        } = feature;

        let fireCentre = null;
        if (FIRE_CENTRE_NAME) {
          fireCentre = await strapi.services["fire-centre"].findOne({
            FireCentreName_contains: FIRE_CENTRE_NAME,
          });
        }

        let fireZone = null;
        if (FIRE_ZONE_NAME) {
          fireZone = await strapi.services["fire-zone"].findOne({
            FireZoneName_contains: FIRE_ZONE_NAME,
          });
        }

        const prohibition = {
          Type: TYPE,
          ProhibitionDescription: ACCESS_PROHIBITION_DESCRIPTION,
          EffectiveDate: ACCESS_STATUS_EFFECTIVE_DATE,
          BulletinURL: BULLETIN_URL,
          fire_centre: fireCentre,
          fire_zone: fireZone,
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
    dataSeed.reduce((acc, { FireCentreNumber, FireZoneNumber }) => {
      acc[FireCentreNumber] = [
        ...(acc[FireCentreNumber] || []),
        { FireZoneNumber },
      ];
      return acc;
    }, {})
  ).map(([key, value]) => ({ FireCentreNumber: key, FireZoneNumber: value }));

  for (const xref of fireZoneXref) {
    const fireCentre = await strapi.services["fire-centre"].findOne({
      FireCentreNumber: xref.FireCentreNumber,
    });
    if (fireCentre) {
      let fireZones = [];
      for (const item of xref.FireZoneNumber) {
        const fireZone = await strapi.services["fire-zone"].findOne({
          FireZoneNumber: item.FireZoneNumber,
        });
        fireZones = [...fireZones, fireZone];
      }

      if (fireZones.length > 0) {
        fireCentre.FireZones = fireZones;
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
    dataSeed.reduce((acc, { ORCS, ActivityID }) => {
      acc[ORCS] = [...(acc[ORCS] || []), { ActivityID }];
      return acc;
    }, {})
  ).map(([key, value]) => ({ ORCS: key, ActivityID: value }));

  for (const xref of xrefs) {
    const protectedArea = await strapi.services["protected-area"].findOne({
      ORCS: xref.ORCS,
    });
    if (protectedArea) {
      let activities = [];
      for (const item of xref.ActivityID) {
        const activity = await strapi.services["activity"].findOne({
          ActivityNumber: item.ActivityID,
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
    dataSeed.reduce((acc, { ORCS, FacilityID }) => {
      acc[ORCS] = [...(acc[ORCS] || []), { FacilityID }];
      return acc;
    }, {})
  ).map(([key, value]) => ({ ORCS: key, FacilityID: value }));

  for (const xref of xrefs) {
    const protectedArea = await strapi.services["protected-area"].findOne({
      ORCS: xref.ORCS,
    });
    if (protectedArea) {
      let facilities = [];
      for (const item of xref.FacilityID) {
        const facility = await strapi.services["facility"].findOne({
          FacilityNumber: item.FacilityID,
        });
        facilities = [...facilities, facility];
      }

      if (facilities.length > 0) {
        protectedArea.Facilities = facilities;
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
    dataSeed.reduce((acc, { ORCS, FireZoneNumber }) => {
      acc[ORCS] = [...(acc[ORCS] || []), { FireZoneNumber }];
      return acc;
    }, {})
  ).map(([key, value]) => ({ ORCS: key, FireZoneNumber: value }));

  for (const parkXref of parkFireZoneXref) {
    const protectedArea = await strapi.services["protected-area"].findOne({
      ORCS: parkXref.ORCS,
    });
    if (protectedArea) {
      let fireZones = [];
      for (const item of parkXref.FireZoneNumber) {
        const fireZone = await strapi.services["fire-zone"].findOne({
          FireZoneNumber: item.FireZoneNumber,
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
      ORCS: data.ORCS,
    });
    if (protectedArea) {
      protectedArea.FogZone = data.FogZone === "Y" ? true : false;

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
    const data = JSON.parse("{}");
    strapi.services["statutory-holidays"].createOrUpdate(data);
  } catch (error) {
    strapi.log.error(error);
  }
};

module.exports = {
  loadBusinessHours,
  loadStatutoryHolidays,
  loadPublicAdvisory,
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
