"use strict";
const _ = require("lodash");

const { sanitizeEntity } = require("strapi-utils");

const boolToYN = (boolVar) => {
  return boolVar ? "Y" : "N";
};

const getHasCampfiresFacility = (parkFacilities) => {
  return parkFacilities.some((f) => f.name.toLowerCase().includes("campfires"));
};

const getParkActivity = async () => {
  const parkActivityData = await strapi
    .query("park-activity")
    .find({ _limit: -1, isActive: true });

  const parkActivities = parkActivityData.map((m) => {
    if (m.protectedArea && m.protectedArea.orcs) {
      return {
        orcs: m.protectedArea.orcs,
        activityName: m.activityType.activityName,
        activityCode: m.activityType.activityCode,
        isactivityOpen: m.isactivityOpen,
        icon: m.activityType.icon,
        iconNA: m.activityType.iconNA,
        rank: m.activityType.rank,
      };
    }
  });

  return Object.entries(
    parkActivities.reduce((acc, parkActivity) => {
      if (parkActivity) {
        acc[parkActivity.orcs] = [
          ...(acc[parkActivity.orcs] || []),
          {
            activityName: parkActivity.activityName,
            activityCode: parkActivity.activityCode,
            isActivityOpen: parkActivity.isActivityOpen,
            icon: parkActivity.icon,
            iconNA: parkActivity.iconNA,
            rank: parkActivity.rank,
          },
        ];
      }
      return acc;
    }, {})
  ).map(([key, value]) => ({ orcs: key, parkActivities: value }));
};

const getParkFacility = async () => {
  const parkFacilityData = await strapi
    .query("park-facility")
    .find({ _limit: -1, isActive: true });

  const parkFacilities = parkFacilityData.map((m) => {
    if (m.protectedArea && m.protectedArea.orcs && m.facilityType) {
      return {
        orcs: m.protectedArea.orcs,
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
        acc[parkFacility.orcs] = [
          ...(acc[parkFacility.orcs] || []),
          {
            facilityName: parkFacility.facilityName,
            facilityCode: parkFacility.facilityCode,
            isFacilityOpen: parkFacility.isFacilityOpen,
            icon: parkFacility.icon,
            iconNA: parkFacility.iconNA,
            rank: parkFacility.rank,
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
  return await strapi.query("public-advisory").find({
    _publicationState: "live",
    _sort: "id",
    _limit: -1,
  });
};

// custom route for park status view
const getProtectedAreaStatus = async (ctx) => {
  let entities;
  if (ctx.query._q) {
    entities = await strapi.services["protected-area"].search(ctx.query);
  } else {
    entities = await strapi.services["protected-area"].find(ctx.query);
  }

  const regions = await strapi.query("region").find({ _limit: -1 });
  const sections = await strapi.query("section").find({ _limit: -1 });
  const fireCentres = await strapi.query("fire-centre").find({ _limit: -1 });
  const linkTypes = await strapi.query("link-type").find({ _limit: -1 });
  const parq = await strapi.query("protected-area").find({ _limit: 1 });
  const pars = await strapi.services["protected-area"].find({ _limit: 1 });

  const parkNamesAliasesData = await strapi
    .query("park-name")
    .find({ _limit: -1, "parkNameType.nameType": "Alias" });

  const publicAdvisories = await getPublishedPublicAdvisories();
  const parkActivitiesData = await getParkActivity();
  const parkFacilitiesData = await getParkFacility();

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

    const fireZones = protectedArea.fireZones.map((fireZone) => {
      return {
        fireZoneName: fireZone.fireZoneName,
        headquartersCityName: fireZone.headquartersCityName,
        fireCentreName: fireCentres.find((f) => f.id === fireZone.fireCentre)
          .fireCentreName,
      };
    });

    const [{ parkActivities } = { parkActivities: [] }] =
      parkActivitiesData.filter((p) => +p.orcs === protectedArea.orcs);

    const [{ parkFacilities } = { parkFacilities: [] }] =
      parkFacilitiesData.filter((p) => +p.orcs === protectedArea.orcs);

    const parkNamesAliases = parkNamesAliasesData
      .filter((p) => +p.protectedArea.orcs === protectedArea.orcs)
      .map((d) => d.parkName);

    return {
      orcs: protectedArea.orcs,
      orcsSiteNumber: null,
      protectedAreaName: protectedArea.protectedAreaName,
      protectedAreaNameAliases: parkNamesAliases,
      type: protectedArea.type,
      typeCode: protectedArea.typeCode,
      accessStatus: publicAdvisory.accessStatus,
      accessDetails: publicAdvisory.advisoryTitle,
      isReservationsAffected: boolToYN(publicAdvisory.reservationsAffected),
      eventType: publicAdvisory.eventType,
      hasCampfiresFacility: boolToYN(
        getHasCampfiresFacility(protectedArea.parkFacilities)
      ),
      hasCampfireBan: boolToYN(protectedArea.hasCampfireBan),
      hasSmokingBan: boolToYN(protectedArea.hasSmokingBan),
      hasCampfireBanOverride: boolToYN(protectedArea.hasCampfireBanOverride),
      hasSmokingBanOverride: boolToYN(protectedArea.hasSmokingBanOverride),
      campfireBanEffectiveDate: null,
      campfireBanRescindedDate: protectedArea.campfireBanRescindedDate,
      accessStatusEffectiveDate: publicAdvisory.effectiveDate,
      accessStatusRescindedDate: publicAdvisory.endDate,
      fireZones: fireZones,
      isFogZone: boolToYN(protectedArea.isFogZone),
      parkRegionName: regionName,
      parkSectionName: sectionName,
      parkManagementAreaName: managementAreaName,
      parkActivities: parkActivities,
      parkFacilities: parkFacilities,
      orderUrl: null,
      mapUrl: null,
      informationBulletinUrl: null,
      parkWebsiteUrl: protectedArea.url,
      pepRegionId: null,
      pepRegionName: null,
      updated_at: protectedArea.updated_at,
    };
  });
};

module.exports = {
  getProtectedAreaStatus,
};
