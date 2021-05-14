"use strict";
const _ = require("lodash");

const { sanitizeEntity } = require("strapi-utils");

const getCampfireFacility = (facilities) => {
  return facilities.some((f) => f.facilityName.toLowerCase() === "campfires");
};

const getPublicAdvisory = (publishedAdvisories, orcs) => {
  const filteredByOrcs = publishedAdvisories.filter((f) =>
    f.protectedAreas.some((o) => o.orcs == orcs)
  );
  let publicAdvisories = [];

  const publicAdvisoryDefaultValues = {
    advisoryNumber: null,
    advisoryTitle: null,
    eventType: null,
    accessStatus: "Open",
    precedence: 99,
    reservationsAffected: null,
  };

  filteredByOrcs.map((p) => {
    const data = {
      advisoryNumber: p.advisoryNumber,
      advisoryTitle: p.title,
      effectiveDate: p.effectiveDate,
      eventType: p.eventType ? p.eventType.eventType : null,
      accessStatus: p.accessStatus ? p.accessStatus.accessStatus : null,
      precedence: p.accessStatus ? p.accessStatus.precedence : null,
      reservationsAffected: p.reservationsAffected,
    };
    publicAdvisories = [...publicAdvisories, data];
  });

  if (publicAdvisories.length === 0)
    publicAdvisories = [publicAdvisoryDefaultValues];

  return _.sortBy(publicAdvisories, ["precedence"])[0];
};

const getPublishedPublicAdvisories = async () => {
  const publicAdvisoryQuery = {
    _publicationState: "live",
    _sort: "id",
  };

  return await strapi.query("public-advisory").find(publicAdvisoryQuery);
};

// custom route for park id and name only
const getProtecteAreaNames = async (ctx) => {
  let entities;
  if (ctx.query._q) {
    entities = await strapi.services["protected-area"].search(ctx.query);
  } else {
    entities = await strapi.services["protected-area"].find(ctx.query);
  }

  return entities.map((entity) => {
    const { id, protectedAreaName } = sanitizeEntity(entity, {
      model: strapi.models["protected-area"],
    });

    return { id, protectedAreaName };
  });
};

// custom route for park status view
const getProtecteAreaStatus = async (ctx) => {
  let entities;
  if (ctx.query._q) {
    entities = await strapi.services["protected-area"].search(ctx.query);
  } else {
    entities = await strapi.services["protected-area"].find(ctx.query);
  }

  const regions = await strapi.query("region").find();
  const sections = await strapi.query("section").find();
  const fireCentres = await strapi.query("fire-centre").find();

  const publicAdvisories = await getPublishedPublicAdvisories();

  const hasCampfireBans = false;

  return entities.map((protectedArea) => {
    let publicAdvisory = getPublicAdvisory(
      publicAdvisories,
      protectedArea.orcs
    );

    let regionName = null;
    let sectionName = null;
    let managementAreaName = null;
    if (protectedArea.managementAreas.length > 0) {
      const regionId = protectedArea.managementAreas[0].region;
      if (regionId)
        regionName = regions.filter((x) => x.id === regionId)[0].regionName;

      const sectionId = protectedArea.managementAreas[0].Section;
      if (sectionId)
        sectionName = sections.filter((x) => x.id === sectionId)[0].sectionName;

      managementAreaName = protectedArea.managementAreas[0].managementAreaName;
    }

    let fireZoneName = null;
    let fireCentreName = null;
    if (protectedArea.fireZones.length > 0) {
      fireZoneName = protectedArea.fireZones[0].fireZoneName;
      const fireCentreId = protectedArea.fireZones[0].fireCentre;
      if (fireCentreId)
        fireCentreName = fireCentres.filter((x) => x.id === fireCentreId)[0]
          .fireCentreName;
    }

    return {
      orcsPrimary: protectedArea.orcs,
      orcsSecondary: null,
      protectedLandsName: protectedArea.protectedAreaName,
      protectedLandsDesignation: protectedArea.type,
      protectedLandsCode: protectedArea.typeCode,
      accessStatus: publicAdvisory.accessStatus,
      accessDetails: publicAdvisory.advisoryTitle,
      reservationsAffectedInd: publicAdvisory.reservationsAffected,
      eventType: publicAdvisory.eventType,
      facilitiesCampfiresInd: getCampfireFacility(protectedArea.facilities),
      campfireBanInd: hasCampfireBans,
      accessStatusEffectiveDate: protectedArea.fffectiveDate,
      accessStatusRescindedDate: null,
      campfireBanEffectiveDate: null,
      campfireBanRescindedDate: null,
      fireCentreName: fireCentreName,
      fireZoneName: fireZoneName,
      fogZoneInd: protectedArea.fogZone,
      parkRegionName: regionName,
      parkSectionName: sectionName,
      parkManagementAreaName: managementAreaName,
      orderUrl: null,
      mapUrl: null,
      informationBulletinUrl: null,
      parkWebsiteUrl: null,
      pepRegionId: null,
      pepRegionName: null,
      updated_at: protectedArea.updated_at,
    };
  });
};

module.exports = {
  getProtecteAreaStatus,
  getProtecteAreaNames,
};
