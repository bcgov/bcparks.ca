"use strict";
const axios = require("axios");
const moment = require("moment");
const utf8 = require("utf8");

const loadParData = async () => {
  const currentProtectedAreas = await strapi.services["protected-area"].find();
  if (currentProtectedAreas.length == 0) {
    strapi.log.info("Loading Protected Areas data..");
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
        strapi.log.error(error);
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
      FeatureId: protectedLandData.featureId,
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
  } catch (error) {
    strapi.log.error(error);
  }
};

module.exports = {
  loadParData,
};
