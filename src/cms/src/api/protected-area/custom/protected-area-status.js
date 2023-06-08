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
        accessStatus: {fields: ["accessStatus"]},
        eventType: { fields: ["eventType"] },
        links: { populate: { type: { fields: ["type"] } } }
      },

      // v4 VS v3
      // "accessStatus.precedence_lt": 99,

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

// custom route for park status view
const getProtectedAreaStatus = async (ctx) => {
  let entities;
  const { accessStatus, accessStatus_ne, ...query } = ctx.query;

  const protectedAreaPopulateSettings = {
    fireZones: {  
      fields: ["fireZoneName"],
      populate: {
        fireCentre: { fields: ["id"]}
      }
    },
    managementAreas: {
      fields: ["managementAreaName"],
      populate: {
        region: { fields: ["id"]},
        section: { fields: ["id"]}
      }            
    },
    parkActivities: {
      fields: ["description"],
      populate: { 
        activityType: { fields: ["activityName", "activityCode", "icon", "iconNA", "rank"] }
      }
    },
    parkFacilities: {
      fields: ["description"],
      populate: { 
        facilityType: { fields: ["facilityName", "facilityCode", "icon", "iconNA", "rank"] }
      }
    }
  };

  if (accessStatus || accessStatus_ne) {
    entities = await strapi.entityService.findMany(
      "api::protected-area.protected-area",
      {
        limit: -1,
        populate: protectedAreaPopulateSettings,
      }
    );
  } else if (ctx.query.queryText) {
    entities = await strapi.entityService.findMany(
      "api::protected-area.protected-area",
      {
        ...ctx.query,
        populate: protectedAreaPopulateSettings,
      }
    );
  } else {
    entities = await strapi.entityService.findMany(
      "api::protected-area.protected-area",
      {
        ...query,
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

  let payload = entities.map((protectedArea) => {
    let publicAdvisory = getPublicAdvisory(
      publicAdvisories,
      protectedArea.orcs
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
