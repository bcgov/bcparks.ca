"use strict";
const _ = require("lodash");

const boolToYN = (boolVar) => {
  return boolVar ? "Y" : "N";
};

const getHasCampfiresFacility = (parkFacilities) => {
  return parkFacilities.some((f) => f.facilityType.facilityName.toLowerCase().includes("campfires"));
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
  return await strapi.entityService.findMany(
    "api::public-advisory.public-advisory",
    {
      publicationState: "live",
      sort: "id",
      limit: -1,
      populate: {
        protectedAreas: { fields: ["orcs"] },
        accessStatus: { fields: ["accessStatus"] },
        eventType: { fields: ["eventType"] },
        links: { populate: { type: { fields: ["type"] } } }
      },
      filters: {
        accessStatus: {
          precedence: {
            $lt: 99,
          },
        },
      },
    }
  );
};

const getPublicAdvisoryAudits = async () => {
  return await strapi.entityService.findMany(
    "api::public-advisory-audit.public-advisory-audit",
    {
      fields: ["advisoryNumber"],
      filters: {
        isLatestRevision: true
      },
      sort: "id:DESC"
    }
  );
};

// custom route for park status view
const getProtectedAreaStatus = async (ctx) => {
  let entities;
  const {
    accessStatus,
    accessStatus_ne,
    accessStatus_contains,
    eventType,
    eventType_ne,
    eventType_contains,
    limit,
    pagination,
    populate,
    fields,
    ...query
  } = ctx.query;

  const protectedAreaPopulateSettings = {
    fireZones: {  
      fields: ["fireZoneName"],
      populate: {
        fireCentre: { fields: ["id"]}
      }
    },
    naturalResourceDistricts: {
      fields: ["naturalResourceDistrictName"],
    },
    managementAreas: {
      fields: ["managementAreaName"],
      populate: {
        region: { fields: ["id"]},
        section: { fields: ["id"]},
        searchArea: { fields: ["id"]}
      }            
    },
    parkActivities: {
      fields: ["id"],
      populate: { 
        activityType: { fields: ["activityName", "activityCode"] }
      }
    },
    parkFacilities: {
      fields: ["id"],
      populate: { 
        facilityType: { fields: ["facilityName", "facilityCode"] }
      }
    },
    parkCampingTypes: {
      fields: ["id"],
      populate: {
        campingType: { fields: ["campingTypeName", "campingTypeCode"] }
      }
    }
  };

  if (
    accessStatus
    || accessStatus_ne
    || accessStatus_contains
    || eventType
    || eventType_ne
    || eventType_contains
  ) {
    entities = await strapi.entityService.findMany(
      "api::protected-area.protected-area",
      {
        ...query,
        limit: -1,
        populate: protectedAreaPopulateSettings,
      }
    );
  } else {
    entities = await strapi.entityService.findMany(
      "api::protected-area.protected-area",
      {
        ...ctx.query,
        populate: protectedAreaPopulateSettings
      }
    );
  }

  const regionsData = await strapi.entityService.findMany(
    "api::region.region",
    {
      limit: -1,
      populate: "*",
    }
  );
  const sectionsData = await strapi.entityService.findMany(
    "api::section.section",
    {
      limit: -1,
      populate: "*",
    }
  );
  const searchAreasData = await strapi.entityService.findMany(
    "api::search-area.search-area",
    {
      limit: -1,
      populate: "*",
    }
  );
  const fireCentresData = await strapi.entityService.findMany(
    "api::fire-centre.fire-centre",
    {
      limit: -1,
      populate: "*",
    }
  );
  const parkNamesAliases = await strapi.entityService.findMany(
    "api::park-name.park-name",
    {
      limit: -1,
      populate: "*",
      filters: {
        parkNameType: {
          nameType: "Alias",
        },
      },
    }
  );

  let publicAdvisories = await getPublishedPublicAdvisories();
  let publicAdvisoryAudits = await getPublicAdvisoryAudits();

  let payload = entities.map((protectedArea) => {
    let publicAdvisory = getPublicAdvisory(
      publicAdvisories,
      protectedArea.orcs
    );

    const publicAdvisoryAudit = publicAdvisoryAudits.find(
      (f) => f.advisoryNumber === publicAdvisory.advisoryNumber
    );

    const regions = [
      ...new Set(
        protectedArea.managementAreas.map(
          (m) =>
            regionsData.find((region) => region.id === m.region?.id)
              ?.regionName
        )
      ),
    ];

    const sections = [
      ...new Set(
        protectedArea.managementAreas.map(
          (m) =>
            sectionsData.find(
              (section) => section.id === m.section?.id
            )?.sectionName
        )
      ),
    ];

    const searchAreas = [
      ...new Set(
        protectedArea.managementAreas.map(
          (m) =>
            searchAreasData.find(
              (searchArea) => searchArea.id === m.searchArea?.id
            )?.searchAreaName
        )
      ),
    ];

    const fireCentres = [
      ...new Set(
        protectedArea.fireZones.map((fireZone) => {
          const fireCentre = fireCentresData.find(
            (f) => f.fireZones.length > 0 && f.id === fireZone.fireCentre?.id
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

    const naturalResourceDistricts = [
      ...new Set(
        protectedArea.naturalResourceDistricts.map((naturalResourceDistrict) => naturalResourceDistrict.naturalResourceDistrictName)
      ),
    ];

    const parkActivities = protectedArea.parkActivities.map((a) => {
      return {
        activityName: a.activityType.activityName,
        activityCode: a.activityType.activityCode,
        description: a.description,
        icon: a.activityType.icon,
        iconNA: a.activityType.iconNA,
        rank: a.activityType.rank,
      };
    });

    const parkFacilities = protectedArea.parkFacilities.map((a) => {
      return {
        facilityName: a.facilityType.facilityName,
        facilityCode: a.facilityType.facilityCode,
        description: a.description,
        icon: a.facilityType.icon,
        iconNA: a.facilityType.iconNA,
        rank: a.facilityType.rank,
      };
    });

    const parkCampingTypes = protectedArea.parkCampingTypes.map((a) => {
      return {
        campingTypeName: a.campingType.campingTypeName,
        campingTypeCode: a.campingType.campingTypeCode,
        description: a.description,
        icon: a.campingType.icon,
        iconNA: a.campingType.iconNA,
        rank: a.campingType.rank,
      };
    });

    const links = publicAdvisory.links.map((link) => {
      return {
        title: link.title,
        type: link.type.type,
        url: link.url,
      };
    });

    // bans and prohibitions
    let campfireBanNote = "";
    if (protectedArea.hasCampfireBanOverride) {
      campfireBanNote = "campfire ban set via manual override";
    } else {
      campfireBanNote = "campfire ban set via wildfire service";
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

      hasCampfireBan: boolToYN(protectedArea.hasCampfireBan),
      hasSmokingBan: boolToYN(protectedArea.hasCampfireBan),
      hasCampfireBanOverride: boolToYN(protectedArea.hasCampfireBanOverride),
      hasSmokingBanOverride: boolToYN(protectedArea.hasSmokingBanOverride),
      campfireBanEffectiveDate: protectedArea.campfireBanEffectiveDate,
      campfireBanRescindedDate: protectedArea.campfireBanRescindedDate,
      campfireBanNote: campfireBanNote,
      accessStatusEffectiveDate: publicAdvisory.effectiveDate,
      accessStatusRescindedDate: publicAdvisory.endDate,
      fireCentres: fireCentres,
      fireZones: fireZones,
      naturalResourceDistricts: naturalResourceDistricts,
      isFogZone: boolToYN(protectedArea.isFogZone),
      regions: regions,
      sections: sections,
      searchAreas: searchAreas,
      managementAreas: protectedArea.managementAreas.map(
        (m) => m.managementAreaName
      ),
      parkActivities: parkActivities,
      parkFacilities: parkFacilities,
      parkCampingTypes: parkCampingTypes,
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
      publicAdvisoryAuditId: publicAdvisoryAudit?.id
    };
  });

  // custom filters on accessStatus derived field
  if (accessStatus) {
    payload = payload.filter(
      (o) => o?.accessStatus?.toLowerCase() == accessStatus.toLowerCase()
    );
  }
  if (accessStatus_ne) {
    payload = payload.filter(
      (o) => o?.accessStatus?.toLowerCase() != accessStatus_ne.toLowerCase()
    );
  }
  if (accessStatus_contains) {
    payload = payload.filter(
      (o) => o?.accessStatus?.toLowerCase().includes(accessStatus_contains.toLowerCase())
    );
  }

  // custom filters on eventType derived field
  if (eventType) {
    payload = payload.filter(
      (o) => o?.eventType?.toLowerCase() == eventType.toLowerCase()
    );
  }
  if (eventType_ne) {
    payload = payload.filter(
      (o) => o?.eventType?.toLowerCase() != eventType_ne.toLowerCase()
    );
  }
  if (eventType_contains) {
    payload = payload.filter(
      (o) => o?.eventType?.toLowerCase().includes(eventType_contains.toLowerCase())
    );
  }

  return payload;
};

module.exports = {
  getProtectedAreaStatus,
};
