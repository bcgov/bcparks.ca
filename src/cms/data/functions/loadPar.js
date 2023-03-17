"use strict";
const axios = require("axios");
const moment = require("moment");
const utf8 = require("utf8");
const fs = require("fs");

const loadParData = async () => {
  const PAR_URL = "https://a100.gov.bc.ca/pub/parws/protectedLands";
  strapi.log.info("Loading Protected Areas data..");
  try {
    const response = await axios
      .get(PAR_URL, {
        params: {
          protectedLandName: "%",
          protectedLandTypeCodes: "CS,ER,PA,PK,RA",
        },
      });
    if (response.data) {
      const protectedAreas = [...response.data.data];
      strapi.log.info(
        `Retrieved ${protectedAreas.length} records from PAR. Loading into cms...`
      );
      for (const protectedArea of protectedAreas) {
        await loadProtectedLandData(protectedArea).then((res) => {
          return res;
        });
      }
      strapi.log.info("PAR data loaded successfully");
    }
  } catch (error) {
    strapi.log.error(error);
  }
};

const loadAdditionalParData = async () => {
  await loadAdditionalProtectedAreaInfo();
  await loadAdditionalSiteInfo();
  await loadParkDetails();
  await loadParkUrl();
  await loadParSomeDefaultValues();
};

const loadRegion = async (area) => {
  let region = await strapi.query("region").findOne({
    regionNumber: area.protectedLandRegionNumber,
  });
  if (!region) {
    region = await strapi.services["region"].create({
      regionNumber: area.protectedLandRegionNumber,
      regionName: area.protectedLandRegionName,
    });
  }
  return region;
};

const loadSection = async (area, region) => {
  let section = await strapi.query("section").findOne({
    sectionNumber: area.protectedLandSectionNumber,
  });
  if (!section) {
    section = await strapi.services["section"].create({
      sectionNumber: area.protectedLandSectionNumber,
      sectionName: area.protectedLandSectionName,
      region: region,
    });
  }
  return section;
};

const loadManagementArea = async (area, region, section) => {
  let managementArea = await strapi.query("management-area").findOne({
    managementAreaNumber: area.protectedLandManagementAreaNumber,
  });
  if (!managementArea) {
    managementArea = await strapi.services["management-area"].create({
      managementAreaNumber: area.protectedLandManagementAreaNumber,
      managementAreaName: area.protectedLandManagementAreaName,
      section: section,
      region: region,
    });
  }
  return managementArea;
};

const loadManagementAreaWithRelations = async (area) => {
  const region = await loadRegion(area);
  const section = await loadSection(area, region);
  const managementArea = await loadManagementArea(area, region, section);
  return managementArea;
};

const loadManagementAreas = async (managementAreas) => {
  const promises = managementAreas.map(
    async (area) => await loadManagementAreaWithRelations(area)
  );
  return await Promise.all(promises);
};

const loadSite = async (site, orcNumber) => {
  let siteObj = await strapi.query("site").findOne({
    orcsSiteNumber: orcNumber + "-" + site.protectedLandSiteNumber,
  });
  if (!siteObj) {
    siteObj = await strapi.services["site"].create({
      orcsSiteNumber: orcNumber + "-" + site.protectedLandSiteNumber,
      siteNumber: site.protectedLandSiteNumber,
      siteName: site.protectedLandSiteName,
      status: site.protectedLandSiteStatusCode,
      establishedDate: site.protectedLandSiteEstablishedDate
        ? moment(site.protectedLandSiteEstablishedDate, "YYYY-MM-DD")
            .tz("UTC")
            .format()
        : null,
      repealedDate: site.protectedLandSiteCanceledDate
        ? moment(site.protectedLandSiteCanceledDate, "YYYY-MM-DD")
            .tz("UTC")
            .format()
        : null,
      url: "",
      latitude: null,
      longitude: null,
      mapZoom: null,
    });
  }
  return siteObj;
};

const loadSites = async (sites, orcNumber) => {
  const promises = sites.map(async (site) => await loadSite(site, orcNumber));
  return await Promise.all(promises);
};

const saveProtectedLandData = async (
  protectedLandData,
  managementAreas,
  sites
) => {
  let protectedArea = await strapi.query("protected-area").findOne({
    orcs: protectedLandData.orcNumber,
  });

  if (!protectedArea) {
    return await strapi.services["protected-area"]
      .create({
        orcs: protectedLandData.orcNumber,
        protectedAreaName: utf8.encode(protectedLandData.protectedLandName),
        totalArea: protectedLandData.totalArea,
        uplandArea: protectedLandData.uplandArea,
        marineArea: protectedLandData.marineArea,
        marineProtectedArea: protectedLandData.marineProtectedAreaInd,
        type: protectedLandData.protectedLandTypeDescription,
        typeCode: protectedLandData.protectedLandTypeCode,
        class: protectedLandData.protectedLandClassCode,
        status: protectedLandData.protectedLandStatusCode,
        featureId: protectedLandData.featureId,
        establishedDate: protectedLandData.establishedDate
          ? moment(protectedLandData.establishedDate, "YYYY-MM-DD")
              .tz("UTC")
              .format()
          : null,
        repealedDate: null,
        url: "",
        latitude: null,
        longitude: null,
        mapZoom: null,
        sites: sites,
        managementAreas: managementAreas,
      });
  } else {
    const id = protectedArea.id;
    return await strapi.services["protected-area"]
      .update(
        { id: id },
        {
          protectedAreaName: utf8.encode(protectedLandData.protectedLandName),
          totalArea: protectedLandData.totalArea,
          uplandArea: protectedLandData.uplandArea,
          marineArea: protectedLandData.marineArea,
          marineProtectedArea: protectedLandData.marineProtectedAreaInd,
          type: protectedLandData.protectedLandTypeDescription,
          typeCode: protectedLandData.protectedLandTypeCode,
          class: protectedLandData.protectedLandClassCode,
          status: protectedLandData.protectedLandStatusCode,
          featureId: protectedLandData.featureId,
          establishedDate: protectedLandData.establishedDate
            ? moment(protectedLandData.establishedDate, "YYYY-MM-DD")
                .tz("UTC")
                .format()
            : null,
          repealedDate: null,
          url: "",
          latitude: null,
          longitude: null,
          mapZoom: null,
          sites: sites,
          managementAreas: managementAreas,
        }
      );
  }
};

const loadProtectedLandData = async (protectedLandData) => {
  try {
    let response = await Promise.all([
      loadManagementAreas(protectedLandData.managementAreas),
      loadSites(protectedLandData.sites, protectedLandData.orcNumber),
    ])

    return await saveProtectedLandData(
      protectedLandData,
      response[0],
      response[1]
    );
  } catch (error) {
    strapi.log.error(error);
  }
};

const loadAdditionalProtectedAreaInfo = async () => {
  try {
    strapi.log.info("loading protected area supplementary information...");
    var jsonData = fs.readFileSync(
      "./data/protected-area-coordinates.json",
      "utf8"
    );
    const data = JSON.parse(jsonData);

    for await (const p of data["protectedArea"]) {
      if (p.status === "Active") {
        const protectedArea = {
          url: p.url,
          isFogZone: p.fogZone,
        };
        if (p.latitude !== "") {
          protectedArea.latitude = p.latitude;
        }
        if (p.longitude !== "") {
          protectedArea.longitude = p.longitude;
        }
        if (p.mapZoom !== "") {
          protectedArea.mapZoom = p.mapZoom;
        }
        await strapi.services["protected-area"].update(
          { orcs: p.orcs },
          protectedArea
        );
      }
    }

    strapi.log.info("loading protected area supplementary information completed...");
  } catch (error) {
    strapi.log.error(error);
  }
};

const loadAdditionalSiteInfo = async () => {
  try {
    strapi.log.info("loading site supplementary information...");
    var jsonData = fs.readFileSync("./data/site-coordinates.json", "utf8");
    const data = JSON.parse(jsonData);
    for await (const s of data["site"]) {
      if (s.status === "Active") {
        const site = { url: s.url };
        if (s.latitude !== "") {
          site.latitude = s.latitude;
        }
        if (s.longitude !== "") {
          site.longitude = s.longitude;
        }
        if (s.mapZoom !== "") {
          site.mapZoom = s.mapZoom;
        }
        if (s.note.includes("custom")) {
          site.isUnofficialSite = true;
        }
        site.note = s.note;

        try {
          await strapi.services["site"].update({ orcsSiteNumber: s.orcs + "-" + s.orcsSiteNumber }, site);
        } catch (error) {
          const protectedArea = await strapi.query("protected-area").findOne({
            orcs: s.orcs,
          });
          strapi.log.info(`creating site ${protectedArea.protectedAreaName}::${s.siteName}`);

          try {
            await strapi.services["site"]
              .create({
                ...site,
                orcsSiteNumber: s.orcs + "-" + s.orcsSiteNumber,
                siteNumber: s.orcsSiteNumber,
                siteName: s.siteName,
                status: s.status[0],
                establishedDate: s.establishedDate
                  ? moment(s.establishedDate, "YYYY-MM-DD").tz("UTC").format()
                  : null,
                repealedDate: s.repealedDate
                  ? moment(s.repealedDate, "YYYY-MM-DD").tz("UTC").format()
                  : null,
                protectedArea: protectedArea,
              });
            } catch (error) {
              strapi.log.error("error creating custom site", error);
            }
        }
      }
    }
    strapi.log.info("loading site supplementary information completed...");
  } catch (error) {
    strapi.log.error(error);
  }
};

const loadParkDetails = async () => {
  const reconciliationNotes =
    "We honour their connection to the land and respect the importance of their diverse teachings, traditions and practices within these territories. This park webpage may not adequately represent the full history of this park and the relationship of Indigenous peoples to this land. As such, BC Parks is working in partnership to update information found on our websites to better reflect the history, cultures and connection of Indigenous peoples to the land and to work together to protect these special places.";

  try {
    strapi.log.info("loading park details");
    var jsonData = fs.readFileSync("./data/park-details.json", "utf8");
    const data = JSON.parse(jsonData);

    for await (const park of data["parkDetails"]) {
      // if the park has an orcsSiteNumber then it is a site, not a protectedArea
      if (park.orcsSiteNumber !== "") {
        continue;
      }
      const orcsExists = await strapi.services["protected-area"].findOne({ orcs: park.orcs });
      const protectedArea = {
        description: park.description,
        safetyInfo: park.safetyInfo,
        specialNotes: park.specialNotes,
        locationNotes: park.locationNotes,
        parkContact: park.parkContact,
        reservations: park.reservations,
        maps: park.maps,
        natureAndCulture: park.natureAndCulture,
        reconciliationNotes: reconciliationNotes,
        purpose: park.purpose,
        managementPlanning: park.managementPlanning,
        partnerships: park.partnerships,
        isDisplayed: orcsExists?.isDisplayed || park.isDisplayed || false,
      };

      if (typeof park.protectedAreaName !== "undefined") {
        protectedArea.protectedAreaName = park.protectedAreaName;
      }

      try {
        if (orcsExists) {
          // we only want to update parks here, not create.  If a park didn't exist in PAR
          // then we don't want it in Strapi. This is partly because these parks don't have
          // ParkNames associated with them and partly because they are all old parks that
          // no longer exist.
          await strapi.services["protected-area"].update({ orcs: park.orcs }, protectedArea);
        }
      } catch (error) {
        strapi.log.error(`error load park details: orcs ${park.orcs}`, error);
      }
    }
    strapi.log.info("loading park details completed...");
  } catch (error) {
    strapi.log.error(error);
  }
};

const loadParkUrl = async () => {
  try {
    strapi.log.info("loading park urls");
    var jsonData = fs.readFileSync("./data/park-urls.json", "utf8");
    const data = JSON.parse(jsonData);

    for await (const park of data["parkUrls"]) {
      const protectedArea = {
        url: park.url,
        oldUrl: park.oldUrl,
        slug: park.url.replace("https://bcparks.ca/", "").replace(/\/$/, ""),
      };
      try {
        await strapi.services["protected-area"].update({ orcs: park.orcs }, protectedArea);
      } catch (error) {
        strapi.log.error(`error load park urls: orcs ${park.orcs}`, error);
      }
    }
    strapi.log.info("loading park urls completed...");
  } catch (error) {
    strapi.log.error(error);
  }
};

// load some default value for graphql to load
const loadParSomeDefaultValues = async () => {
  strapi.log.info("loading park default values started...");
  const protectedAreas = await strapi.services["protected-area"].find({
    _limit: -1,
  });

  for (const protectedArea of protectedAreas) {
    const updateData = {
      isFogZone: protectedArea.isFogZone === true ? true : false,
      hasCampfireBan: protectedArea.hasCampfireBan === true ? true : false,
      hasSmokingBan: protectedArea.hasSmokingBan === true ? true : false,
    };

    try {
      await strapi.services["protected-area"].update({ id: protectedArea.id }, updateData);
    } catch (error) {
      strapi.log.error(`error load park details: orcs ${protectedArea.orcs}`, error);
    }
  }
  strapi.log.info("loading park default values completed...");
};

module.exports = {
  loadParData,
  loadAdditionalParData,
  loadParkDetails,
  loadParkUrl,
  loadParSomeDefaultValues,
};
