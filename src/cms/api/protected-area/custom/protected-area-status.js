"use strict";
const _ = require("lodash");

const { sanitizeEntity } = require("strapi-utils");

const getCampfireFacility = (facilities) => {
  return facilities.some((f) => f.facilityName.toLowerCase() === "campfires");
};

const getParkActivity = async () => {
  const parkActivityQuery = {
    _limit: -1,
    isActive: true,
  };
  const parkActivityData = await strapi
    .query("park-activity")
    .find(parkActivityQuery);

  const parkActivities = parkActivityData.map((m) => {
    if (m.protectedArea && m.protectedArea.orcs) {
      return {
        orcs: m.protectedArea.orcs,
        facilityNumber: m.activityType.facilityNumber,
        facilityName: m.activityType.facilityName,
        facilityCode: m.activityType.facilityCode,
        isFacilityOpen: m.isFacilityOpen,
        icon: m.activityType.icon,
        iconNA: m.activityType.iconNA,
        rank: m.activityType.rank,
      };
    }
  });

  return Object.entries(
    parkActivities.reduce((acc, parkActivity) => {
      if (parkActivity) {
        const {
          activityNumber,
          activityName,
          activityCode,
          isActivityOpen,
          icon,
          iconNA,
          rank,
        } = parkActivity;
        acc[parkActivity.orcs] = [
          ...(acc[parkActivity.orcs] || []),
          {
            activityNumber,
            activityName,
            activityCode,
            isActivityOpen,
            icon,
            iconNA,
            rank,
          },
        ];
      }
      return acc;
    }, {})
  ).map(([key, value]) => ({ orcs: key, parkActivities: value }));
};

const getParkFacility = async () => {
  const parkFacilityQuery = {
    _limit: -1,
    isActive: true,
  };

  const parkFacilityData = await strapi
    .query("park-facility")
    .find(parkFacilityQuery);

  const parkFacilities = parkFacilityData.map((m) => {
    if (m.protectedArea && m.protectedArea.orcs && m.facilityType) {
      return {
        orcs: m.protectedArea.orcs,
        facilityNumber: m.facilityType.facilityNumber,
        facilityName: m.facilityType.facilityName,
        facilityCode: m.facilityType.facilityCode,
        isFacilityOpen: m.isFacilityOpen,
        icon: m.facilityType.icon,
        iconNA: m.facilityType.iconNA,
        rank: m.facilityType.rank,
      };
    }
  });

  return Object.entries(
    parkFacilities.reduce((acc, parkFacility) => {
      if (parkFacility) {
        const {
          facilityNumber,
          facilityName,
          facilityCode,
          isFacilityOpen,
          icon,
          iconNA,
          rank,
        } = parkFacility;
        acc[parkFacility.orcs] = [
          ...(acc[parkFacility.orcs] || []),
          {
            facilityNumber,
            facilityName,
            facilityCode,
            isFacilityOpen,
            icon,
            iconNA,
            rank,
          },
        ];
      }
      return acc;
    }, {})
  ).map(([key, value]) => ({ orcs: key, parkFacilities: value }));
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
    _limit: -1,
  };

  return await strapi.query("public-advisory").find(publicAdvisoryQuery);
};

// custom route for park status view
const getProtectedAreaStatus = async (ctx) => {
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
  const parkActivitiesData = await getParkActivity();
  const parkFacilitiesData = await getParkFacility();

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

    const [{ parkActivities } = { parkActivities: [] }] =
      parkActivitiesData.filter((p) => +p.orcs === protectedArea.orcs);

    const [{ parkFacilities } = { parkFacilities: [] }] =
      parkFacilitiesData.filter((p) => +p.orcs === protectedArea.orcs);

    return {
      orcsPrimary: protectedArea.orcs,
      orcsSecondary: null,
      protectedLandsName: protectedArea.protectedAreaName,
      protectedLandsDesignation: protectedArea.type,
      protectedLandsCode: protectedArea.typeCode,
      accessStatus: publicAdvisory.accessStatus,
      accessDetails: publicAdvisory.advisoryTitle,
      isReservationsAffected: publicAdvisory.reservationsAffected,
      eventType: publicAdvisory.eventType,
      //facilitiesCampfiresInd: getCampfireFacility(protectedArea.facilities),
      hasSmokingBan: protectedArea.hasSmokingBan,
      hasCampfireBan: protectedArea.hasCampfireBan,
      campfireBanEffectiveDate: null,
      campfireBanRescindedDate: null,
      accessStatusEffectiveDate: publicAdvisory.effectiveDate,
      accessStatusRescindedDate: null,
      fireCentreName: fireCentreName,
      fireZoneName: fireZoneName,
      isFogZone: protectedArea.isFogZone,
      parkRegionName: regionName,
      parkSectionName: sectionName,
      parkManagementAreaName: managementAreaName,
      parkActivities: parkActivities,
      parkFacilities: parkFacilities,
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
  getProtectedAreaStatus,
};
