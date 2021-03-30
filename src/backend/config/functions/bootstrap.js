"use strict";
const fs = require("fs");

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#bootstrap
 */
const createParks = async () => {
  const currentParks = await strapi.services.park.find();
  if (currentParks.length == 0) {
    console.log("Loading Parks data");
    var parksData = fs.readFileSync("./data/park.json", "utf8");
    const parks = JSON.parse(parksData);
    parks.forEach((park) => {
      strapi.services.park.create({
        ParkID: park.ParkID,
        TypeCode: park.TypeCode,
        ParkName: park.ParkName,
        URL: park.URL,
        Latitude: park.Latitude,
        Longitude: park.Longitude,
        EstablishedDate: park.EstablishedDate,
        TotalArea: park.TypeCode,
        UploadArea: park.UploadArea,
        MarineArea: park.MarineArea,
      });
  }
};

const loadRegion = async (area) => {
  const region = await Promise.resolve(
    strapi.services["region"].create({
      RegionNumber: area.protectedLandRegionNumber,
      RegionName: area.protectedLandRegionName,
    })
  )
    .catch(() => {
      return Promise.resolve(
        strapi.query("region").findOne({
          RegionNumber: area.protectedLandRegionNumber,
        })
      );
    })
    .finally(() => {});
  return region;
};

const loadSection = async (area, region) => {
  const section = await Promise.resolve(
    strapi.services["section"].create({
      SectionNumber: area.protectedLandSectionNumber,
      SectionName: area.protectedLandSectionName,
      Region: region,
    })
  )
    .catch(() => {
      return Promise.resolve(
        strapi.query("section").findOne({
          SectionNumber: area.protectedLandSectionNumber,
        })
      );
    })
    .finally(() => {});
  return section;
};

const loadManagementArea = async (area, region, section) => {
  const managementArea = await Promise.resolve(
    strapi.services["management-area"].create({
      ManagementAreaNumber: area.protectedLandManagementAreaNumber,
      ManagementAreaName: area.protectedLandManagementAreaName,
      Section: section,
      Region: region,
    })
  )
    .catch(() => {
      return Promise.resolve(
        strapi.query("management-area").findOne({
          ManagementAreaNumber: area.protectedLandManagementAreaNumber,
        })
      );
    })
    .finally(() => {});
  return managementArea;
};

const loadManagementAreaWithRelations = async (area) => {
  const region = await loadRegion(area);
  const section = await loadSection(area, region);
  const managementArea = await loadManagementArea(area, region, section);
  return managementArea;
};

const loadManagementAreas = async (managementAreas) => {
  const promises = managementAreas.map((area) =>
    loadManagementAreaWithRelations(area)
  );
  const managementAreasObj = await Promise.all(promises);
  return managementAreasObj;
};

const loadSite = async (site, orcNumber) => {
  const siteObj = await Promise.resolve(
    strapi.services["site"].create({
      ORCSSiteNumber: orcNumber + "-" + site.protectedLandSiteNumber,
      SiteNumber: site.protectedLandSiteNumber,
      SiteName: site.protectedLandSiteName,
      Status: site.protectedLandSiteStatusCode,
      EstablishedDate: site.protectedLandSiteEstablishedDate
        ? moment(site.protectedLandSiteEstablishedDate, "YYYY-MM-DD")
            .tz("UTC")
            .format()
        : null,
      RepealedDate: site.protectedLandSiteCanceledDate
        ? moment(site.protectedLandSiteCanceledDate, "YYYY-MM-DD")
            .tz("UTC")
            .format()
        : null,
      URL: "",
      Latitude: "",
      Longitude: "",
      MapZoom: "",
    })
  )
    .catch(() => {
      return Promise.resolve(
        strapi.query("site").findOne({
          ORCSSiteNumber: orcNumber + "-" + site.protectedLandSiteNumber,
        })
      );
    })
    .finally(() => {});
  return siteObj;
};

const loadSites = async (sites, orcNumber) => {
  const promises = sites.map((site) => loadSite(site, orcNumber));
  const sitesObj = await Promise.all(promises);
  return sitesObj;
};

const loadProtectedLandData = async (protectedLandData) => {
  try {
    const managementAreas = await loadManagementAreas(
      protectedLandData.managementAreas
    );
    const sites = await loadSites(
      protectedLandData.sites,
      protectedLandData.orcNumber
    );
    await strapi.services["protected-area"].create({
      ORCS: protectedLandData.orcNumber,
      ProtectedAreaName: utf8.encode(protectedLandData.protectedLandName),
      TotalArea: protectedLandData.totalArea,
      UplandArea: protectedLandData.uplandArea,
      MarineArea: protectedLandData.marineArea,
      MarineProtectedArea: protectedLandData.marineProtectedAreaInd,
      Type: protectedLandData.protectedLandTypeDescription,
      TypeCode: protectedLandData.protectedLandTypeCode,
      Class: protectedLandData.protectedLandClassCode,
      Status: protectedLandData.protectedLandStatusCode,
      EstablishedDate: protectedLandData.establishedDate
        ? moment(protectedLandData.establishedDate, "YYYY-MM-DD")
            .tz("UTC")
            .format()
        : null,
      RepealedDate: null,
      URL: "",
      Latitude: "",
      Longitude: "",
      MapZoom: "",
      Sites: [...sites],
      ManagementAreas: [...managementAreas],
    });
  } catch (error) {}
};

const loadAccessStatus = async () => {
  const currentData = await strapi.services["access-status"].find();
  if (currentData.length == 0) {
    console.log("Loading Access Statuses..");
    var jsonData = fs.readFileSync("./data/access-status.json", "utf8");
    const dataSeed = JSON.parse(jsonData);
    dataSeed.forEach((data) => {
      strapi.services["access-status"].create(data);
    });
  }
};

const loadAdvisoryStatus = async () => {
  const currentData = await strapi.services["advisory-status"].find();
  if (currentData.length == 0) {
    console.log("Loading Event Statuses..");
    var jsonData = fs.readFileSync("./data/advisory-status.json", "utf8");
    const dataSeed = JSON.parse(jsonData);
    dataSeed.forEach((data) => {
      strapi.services["advisory-status"].create(data);
    });
  }
};

const loadEventType = async () => {
  const currentData = await strapi.services["event-type"].find();
  if (currentData.length == 0) {
    console.log("Loading Event Statuses..");
    var jsonData = fs.readFileSync("./data/event-type.json", "utf8");
    const dataSeed = JSON.parse(jsonData);
    dataSeed.forEach((data) => {
      strapi.services["event-type"].create(data);
    });
  }
};

const loadUrgency = async () => {
  const currentData = await strapi.services["urgency"].find();
  if (currentData.length == 0) {
    console.log("Loading Event Statuses..");
    var jsonData = fs.readFileSync("./data/urgency.json", "utf8");
    const dataSeed = JSON.parse(jsonData);
    dataSeed.forEach((data) => {
      strapi.services["urgency"].create(data);
    });
  }
};

const loadPublicAdvisory = async () => {
  const currentData = await strapi.services["public-advisory"].find();
  if (currentData.length == 0) {
    console.log("Loading Public Advisory Event..");
    var jsonData = fs.readFileSync("./data/public-advisory.json", "utf8");
    const dataSeed = JSON.parse(jsonData);
    dataSeed.forEach(async (data) => {
      data.event_type = await strapi
        .query("event-type")
        .findOne({ EventType: data.EventType });

      data.access_status = await strapi
        .query("access-status")
        .findOne({ AccessStatus: data.AccessStatus });

      data.urgency = await strapi
        .query("urgency")
        .findOne({ Urgency: data.Urgency });

      strapi.services["public-advisory"].create(data);
    });
  }
};

// This method is used for testing and development purposes only
const removeAllData = async () => {
  console.log("Removing all data for testing..");
  await strapi.services["protected-area"].delete();
  await strapi.services["section"].delete();
  await strapi.services["management-area"].delete();
  await strapi.services["region"].delete();
  await strapi.services["site"].delete();
  await strapi.services["public-advisory"].delete();
  await strapi.services["access-status"].delete();
  await strapi.services["event-type"].delete();
  await strapi.services["public-advisory"].delete();
};

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

const setDefaultPermissions = async () => {
  const role = await findPublicRole();
  const permissions = await strapi
    .query("permission", "users-permissions")
    .find({ type: "application", role: role.id });
  await Promise.all(
    permissions.map((p) =>
      strapi
        .query("permission", "users-permissions")
        .update({ id: p.id }, { enabled: true })
    )
  );
};

const findPublicRole = async () => {
  const result = await strapi
    .query("role", "users-permissions")
    .findOne({ type: "public" });
  return result;
};

const loadData = async () => {
  try {
    await loadParData();
    await loadAccessStatus();
    await loadAdvisoryStatus();
    await loadEventType();
    await loadUrgency();
    await loadPublicAdvisory();
  } catch (error) {
    console.log(error);
  }
};

module.exports = async () => {
  await createParks();
};
