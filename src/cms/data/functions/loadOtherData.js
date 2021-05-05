"use strict";
const fs = require("fs");
const moment = require("moment");
const loadUtils = require("./loadUtils");

const loadPublicAdvisory = async () => {
  const modelName = "public-advisory";
  const loadSetting = await loadUtils.getLoadSettings(modelName);

  if (loadSetting && loadSetting.purge)
    await strapi.services[modelName].delete();

  if (loadSetting && !loadSetting.reload) return;

  const currentData = await strapi.services[modelName].find();
  if (currentData.length === 0) {
    strapi.log.info(`loading ${modelName}...`);
    var jsonData = fs.readFileSync("./data/public-advisory.json", "utf8");
    const dataSeed = JSON.parse(jsonData)[modelName];

    var jsonData = fs.readFileSync("./data/public-advisory-xref.json", "utf8");
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
      data.protected_areas = orcs;

      data.access_status = await strapi
        .query("access-status")
        .findOne({ AccessStatus: data.AccessStatus });

      data.advisory_status = await strapi
        .query("advisory-status")
        .findOne({ AdvisoryStatus: data.AdvisoryStatus });

      data.event_type = await strapi
        .query("event-type")
        .findOne({ EventType: data.EventType });

      data.urgency = await strapi
        .query("urgency")
        .findOne({ Urgency: data.Urgency });

      data.DCTicketNumber = +data.DCTicketNumber;
      data.ListingRank = +data.ListingRank;
      data.Latitude = +data.Latitude;
      data.Longitude = +data.Longitude;
      data.MapZoom = +data.MapZoom;
      data.AdvisoryDate = data.AdvisoryDate
        ? moment(data.AdvisoryDate, "YYYY-MM-DD").tz("UTC").format()
        : null;
      data.EffectiveDate = data.EffectiveDate
        ? moment(data.EffectiveDate, "YYYY-MM-DD").tz("UTC").format()
        : null;
      data.EndDate = data.EndDate
        ? moment(data.EndDate, "YYYY-MM-DD").tz("UTC").format()
        : null;
      data.ExpiryDate = data.ExpiryDate
        ? moment(data.ExpiryDate, "YYYY-MM-DD").tz("UTC").format()
        : null;
      data.RemovalDate = data.RemovalDate
        ? moment(data.RemovalDate, "YYYY-MM-DD").tz("UTC").format()
        : null;
      data.UpdatedDate = data.UpdatedDate
        ? moment(data.UpdatedDate, "YYYY-MM-DD").tz("UTC").format()
        : null;
      data.DisplayAdvisoryDate = data.DisplayAdvisoryDate
        ? moment(data.DisplayAdvisoryDate, "YYYY-MM-DD").tz("UTC").format()
        : null;
      data.CreatedDate = data.CreatedDate
        ? moment(data.CreatedDate, "YYYY-MM-DD").tz("UTC").format()
        : null;
      data.ModifiedDate = data.ModifiedDate
        ? moment(data.ModifiedDate, "YYYY-MM-DD").tz("UTC").format()
        : null;
      await strapi.services[modelName].create(data);
    });
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
  const currentData = await strapi.services["fire-zone"].find();
  if (currentData.length == 0) {
    strapi.log.info("loading fire zone...");
    var jsonData = fs.readFileSync("./data/fire-zone.json", "utf8");
    const dataSeed = JSON.parse(jsonData)["fire-zone"];
    dataSeed.forEach(async (data) => {
      data.fire_centre = await strapi.services["fire-centre"].findOne({
        FireCentreNumber: data.FireCentreNumber,
      });
      strapi.services["fire-zone"].create(data);
    });
    strapi.log.info("loading fire zone completed...");
  }
};

const loadUrgency = async () => {
  loadUtils.loadJson("urgency", "./data/urgency.json", "urgency");
};

// xref
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
        protectedArea.activities = activities;
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
        protectedArea.fire_zones = fireZones;
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
  loadUrgency,
  loadParkActivityXref,
  loadParkFacilityXref,
  loadParkFireZoneXref,
  loadParkFogZoneXref,
};
