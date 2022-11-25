"use strict";
const _ = require("lodash");

const boolToYN = (boolVar) => {
  return boolVar ? "Y" : "N";
};

const getHasCampfiresFacility = (parkFacilities) => {
  return parkFacilities.some((f) => f.name.toLowerCase().includes("campfires"));
};

const getPublicAdvisory = (publishedAdvisories, orcs) => {
  const filteredByOrcs = publishedAdvisories.filter((f) =>
    f.protectedAreas.some((o) => o.orcs === orcs)
  );
  let publicAdvisories = [];

  const publicAdvisoryDefaultValues = {
    id: 0,
    advisoryNumber: null,
    advisoryTitle: null,
    effectiveDate: null,
    endDate: null,
    eventType: null,
    accessStatus: "Open",
    precedence: 99,
    reservationsAffected: null,
    links: [],
  };

  filteredByOrcs.map((p) => {
    const data = {
      id: p.id,
      advisoryNumber: p.advisoryNumber,
      advisoryTitle: p.title,
      effectiveDate: p.effectiveDate,
      endDate: p.endDate,
      eventType: p.eventType ? p.eventType.eventType : null,
      accessStatus: p.accessStatus ? p.accessStatus.accessStatus : null,
      precedence: p.accessStatus ? p.accessStatus.precedence : null,
      reservationsAffected: p.reservationsAffected,
      links: p.links,
    };
    publicAdvisories = [...publicAdvisories, data];
  });

  if (publicAdvisories.length === 0)
    publicAdvisories = [publicAdvisoryDefaultValues];

  return _.sortBy(publicAdvisories, ["precedence"])[0];
};

const getPublishedPublicAdvisories = async () => {
  return await strapi.services["public-advisory"].find({
    _publicationState: "live",
    "accessStatus.precedence_lt": 99,
    _sort: "id",
    _limit: -1,
  });
};

// custom route for park status view
const getProtectedAreaStatus = async (ctx) => {
  let entities;
  const { accessStatus, accessStatus_ne, ...query } = ctx.query;

  if (accessStatus || accessStatus_ne) {
    entities = await strapi.services["protected-area"].find({ _limit: -1 });
  } else if (ctx.query._q) {
    entities = await strapi.services["protected-area"].search(ctx.query);
  } else {
    entities = await strapi.services["protected-area"].find(query);
  }

  const regionsData = await strapi.services["region"].find({ _limit: -1 });
  const sectionsData = await strapi.services["section"].find({ _limit: -1 });
  const fireCentresData = await strapi.services["fire-centre"].find({
    _limit: -1,
  });
  const activityTypesData = await strapi.services["activity-type"].find({
    _limit: -1,
  });
  const facilityTypesData = await strapi.services["facility-type"].find({
    _limit: -1,
  });
  const linkTypesData = await strapi.services["link-type"].find({ _limit: -1 });
  const parkNamesAliases = await strapi.services["park-name"].find({
    _limit: -1,
    "parkNameType.nameType": "Alias",
  });

  const campfireBanData = await strapi.services["fire-ban-prohibition"].find({
    _limit: -1,
    prohibitionDescription_contains: "campfire",
    fireCentre_null: false,
  });

  const publicAdvisories = await getPublishedPublicAdvisories();

  let payload = entities.map((protectedArea) => {
    let publicAdvisory = getPublicAdvisory(
      publicAdvisories,
      protectedArea.orcs
    );

    const regions = [
      ...new Set(
        protectedArea.managementAreas.map(
          (m) =>
            regionsData.find((region) => region.id === m.region && m.region)
              .regionName
        )
      ),
    ];

    const sections = [
      ...new Set(
        protectedArea.managementAreas.map(
          (m) =>
            sectionsData.find(
              (section) => section.id === m.section && m.section
            ).sectionName
        )
      ),
    ];

    const fireCentres = [
      ...new Set(
        protectedArea.fireZones.map((fireZone) => {
          const fireCentre = fireCentresData.find(
            (f) => f.fireZones.length > 0 && f.id === fireZone.fireCentre
          );
          if (fireCentre) return fireCentre.fireCentreName;
        })
      ),
    ];

    const fireZones = [
      ...new Set(
        protectedArea.fireZones.map((fireZone) => fireZone.fireZoneName)
      ),
    ];

    const parkActivities = protectedArea.parkActivities.map((a) => {
      const activity = activityTypesData.find(
        (f) => f.id === a.activityType && a.isActive
      );
      if (activity) {
        return {
          activityName: activity.activityName,
          activityCode: activity.activityCode,
          description: a.description,
          icon: activity.icon,
          iconNA: activity.iconNA,
          rank: activity.rank,
        };
      }
    });

    const parkFacilities = protectedArea.parkFacilities.map((a) => {
      const facility = facilityTypesData.find(
        (f) => f.id === a.facilityType && a.isActive
      );
      if (facility) {
        return {
          facilityName: facility.facilityName,
          facilityCode: facility.facilityCode,
          description: a.description,
          icon: facility.icon,
          iconNA: facility.iconNA,
          rank: facility.rank,
        };
      }
    });

    const links = publicAdvisory.links.map((link) => {
      return {
        title: link.title,
        type: linkTypesData.find((lt) => lt.id === link.type).type,
        url: link.url,
      };
    });

    // bans and prohibitions
    let hasCampfireBan;
    let campfireBanNote = "";
    let campfireBanEffectiveDate = null;
    if (protectedArea.hasCampfireBanOverride) {
      hasCampfireBan = protectedArea.hasCampfireBan;
      campfireBanNote = "campfire ban set via manual override";
    } else {
      for (const fireZone of protectedArea.fireZones) {
        const fireBan = campfireBanData.find(
          (f) => f.fireCentre.id === fireZone.fireCentre
        );

        if (fireBan) {
          hasCampfireBan = true;
          campfireBanEffectiveDate = fireBan.effectiveDate;
          campfireBanNote = "campfire ban set via wildfire service";
          break;
        }
      }
    }

    let hasSmokingBan;
    if (protectedArea.hasSmokingBanOverride) {
      hasSmokingBan = protectedArea.hasSmokingBan;
    } else {
      for (const fireZone of protectedArea.fireZones) {
        const fireBan = campfireBanData.find(
          (f) => f.fireCentre.id === fireZone.fireCentre
        );

        if (fireBan) {
          hasSmokingBan = true;
          break;
        }
      }
    }

    return {
      id: protectedArea.id,
      orcs: protectedArea.orcs,
      orcsSiteNumber: null,
      protectedAreaName: protectedArea.protectedAreaName,
      protectedAreaNameAliases: parkNamesAliases
        .filter(
          (p) => p.protectedArea && +p.protectedArea.orcs === protectedArea.orcs
        )
        .map((d) => d.parkName),
      type: protectedArea.type,
      typeCode: protectedArea.typeCode,
      accessStatus: publicAdvisory.accessStatus,
      accessDetails: publicAdvisory.advisoryTitle,
      isReservationsAffected: boolToYN(publicAdvisory.reservationsAffected),
      eventType: publicAdvisory.eventType,
      hasCampfiresFacility: boolToYN(
        getHasCampfiresFacility(protectedArea.parkFacilities)
      ),

      hasCampfireBan: boolToYN(hasCampfireBan),
      hasSmokingBan: boolToYN(hasSmokingBan),
      hasCampfireBanOverride: boolToYN(protectedArea.hasCampfireBanOverride),
      hasSmokingBanOverride: boolToYN(protectedArea.hasSmokingBanOverride),
      campfireBanEffectiveDate: campfireBanEffectiveDate,
      campfireBanRescindedDate: protectedArea.campfireBanRescindedDate,
      campfireBanNote: campfireBanNote,
      accessStatusEffectiveDate: publicAdvisory.effectiveDate,
      accessStatusRescindedDate: publicAdvisory.endDate,
      fireCentres: fireCentres,
      fireZones: fireZones,
      isFogZone: boolToYN(protectedArea.isFogZone),
      regions: regions,
      sections: sections,
      managementAreas: protectedArea.managementAreas.map(
        (m) => m.managementAreaName
      ),
      parkActivities: parkActivities,
      parkFacilities: parkFacilities,
      orderUrl: links
        .filter((f) => f.type.toLowerCase().includes("order"))
        .map((m) => m.url),
      mapUrl: links
        .filter((f) => f.type.toLowerCase().includes("map"))
        .map((m) => m.url),
      informationBulletinUrl: links
        .filter((f) => f.type.toLowerCase().includes("bulletin"))
        .map((m) => m.url),
      parkWebsiteUrl: protectedArea.url,
      pepRegionId: null,
      pepRegionName: null,
      publicAdvisoryId: publicAdvisory.id,
    };
  });

  // filter accessStatus field
  if (accessStatus) {
    return (payload = payload.filter(
      (o) => o?.accessStatus?.toLowerCase() == accessStatus.toLowerCase()
    ));
  } else if (accessStatus_ne) {
    return (payload = payload.filter(
      (o) => o?.accessStatus?.toLowerCase() != accessStatus_ne.toLowerCase()
    ));
  }

  return payload;
};

module.exports = {
  getProtectedAreaStatus,
};
