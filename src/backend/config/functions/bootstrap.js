"use strict";
const fs = require("fs");
const axios = require("axios");
const moment = require("moment");
const utf8 = require("utf8");

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#bootstrap
 */
const loadParData = async () => {
  const currentProtectedAreas = await strapi.services["protected-area"].find();
  if (currentProtectedAreas.length == 0) {
    console.log("Loading Protected Areas data..");
    axios
      .get("https://a100.gov.bc.ca/pub/parws/protectedLands", {
        params: {
          protectedLandName: "%",
          protectedLandTypeCodes: "CS,ER,PA,PK,RA",
        },
      })
      .then((response) => {
        const protectedAreas = response.data.data;
        return Promise.resolve(
          protectedAreas.forEach((protectedArea) => {
            loadProtectedLandData(protectedArea);
          })
        );
      })
      .catch((error) => {
        console.log(error);
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

const createApiUser = async () => {
  const authRole = await findRole("authenticated");
  const apiUser = await Promise.resolve(
    strapi.query("user", "users-permissions").create({
      username: process.env.API_USER_NAME,
      email: process.env.API_USER_EMAIL,
      password: process.env.API_USER_PASSWORD,
      provider: "local",
      confirmed: true,
      blocked: false,
      role: authRole,
    })
  );
  return apiUser;
};

const createApiToken = async () => {
  const apiUser = await createApiUser();
  Promise.resolve(
    strapi.services["token"].create({
      Token: process.env.API_TOKEN,
      User: apiUser,
    })
  );
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
  await strapi.services["public-advisory"].delete();
  const currentData = await strapi.services["public-advisory"].find();
  if (currentData.length === 0) {
    console.log("Loading Public Advisory Event..");
    var jsonData = fs.readFileSync("./data/public-advisory.json", "utf8");
    const dataSeed = JSON.parse(jsonData);

    var jsonData = fs.readFileSync("./data/public-advisory-xref.json", "utf8");
    const dataXref = JSON.parse(jsonData);

    dataSeed.public_advisory.map(async (data) => {
      const orcsXref = await dataXref.public_advisory_xref.filter(
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
      console.log(data);
      await strapi.services["public-advisory"].create(data);
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
  const authRole = await findRole("authenticated");

  const authPermissions = await strapi
    .query("permission", "users-permissions")
    .find({ type: "application", role: authRole.id });

  await Promise.all(
    authPermissions.map((p) =>
      strapi
        .query("permission", "users-permissions")
        .update({ id: p.id }, { enabled: true })
    )
  );

  const publicRole = await findRole("public");

  const publicPermissions = await strapi
    .query("permission", "users-permissions")
    .find({
      type: "application",
      role: publicRole.id,
      action_in: ["find", "findone"],
    });

  await Promise.all(
    publicPermissions.map((p) =>
      strapi
        .query("permission", "users-permissions")
        .update({ id: p.id }, { enabled: true })
    )
  );
};

const findRole = async (role) => {
  const result = await strapi
    .query("role", "users-permissions")
    .findOne({ type: role });
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
    await createApiToken();
  } catch (error) {
    console.log(error);
  }
};

module.exports = async () => {
  // Load data and set default public roles on first run
  const shouldSetDefaultPermissions = await isFirstRun();
  if (shouldSetDefaultPermissions) {
    await setDefaultPermissions();
    await loadData();
  }
  await loadPublicAdvisory();
};
