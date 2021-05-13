"use strict";
const _ = require("lodash");

const { sanitizeEntity } = require("strapi-utils");

const getCampfireFacility = (facilities) => {
  return facilities.some((f) => f.FacilityName.toLowerCase() === "campfires");
};

const getPublicAdvisory = (publishedAdvisories, ORCS) => {
  const filteredByORCS = publishedAdvisories.filter((f) =>
    f.ProtectedAreas.some((o) => o.ORCS == ORCS)
  );
  let publicAdvisories = [];

  const publicAdvisoryDefaultValues = {
    AdvisoryNumber: null,
    AdvisoryTitle: null,
    EventType: null,
    AccessStatus: "Open",
    Precedence: 99,
    ReservationsAffected: null,
  };

  filteredByORCS.map((p) => {
    const data = {};
    data.AdvisoryNumber = p.AdvisoryNumber;
    data.AdvisoryTitle = p.Title;
    data.EffectiveDate = p.EffectiveDate;
    data.EventType = p.EventType ? p.EventType.EventType : null;
    data.AccessStatus = p.AccessStatus ? p.AccessStatus.AccessStatus : null;
    data.Precedence = p.AccessStatus ? p.AccessStatus.Precedence : null;
    data.ReservationsAffected = p.ReservationsAffected;
    publicAdvisories = [...publicAdvisories, data];
  });

  if (publicAdvisories.length === 0)
    publicAdvisories = [publicAdvisoryDefaultValues];

  return _.sortBy(publicAdvisories, ["Precedence"])[0];
};

const getPublishedPublicAdvisories = async () => {
  const publicAdvisoryQuery = {
    _publicationState: "live",
    _limit: 10,
    _sort: "id",
  };

  return await strapi.query("public-advisory").find(publicAdvisoryQuery);
};

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { ORCS } = ctx.params;
    const entity = await strapi.services["protected-area"].findOne({ ORCS });
    return sanitizeEntity(entity, { model: strapi.models["protected-area"] });
  },
  async getParkNames(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services["protected-area"].search(ctx.query);
    } else {
      entities = await strapi.services["protected-area"].find(ctx.query);
    }

    return entities.map((entity) => {
      const protectedArea = sanitizeEntity(entity, {
        model: strapi.models["protected-area"],
      });
      let data = {
        id: protectedArea.id,
        ProtectedAreaName: protectedArea.ProtectedAreaName,
      };
      return data;
    });
  },
  async getStatus(ctx) {
    const protectedAreas = await strapi
      .query("protected-area")
      .find({ _limit: -1, _sort: "id" });

    const regions = await strapi.query("region").find();
    const sections = await strapi.query("section").find();
    const fireCentres = await strapi.query("fire-centre").find();

    const publicAdvisories = await getPublishedPublicAdvisories();

    const hasCampfireBans = false;

    return protectedAreas.map((protectedArea) => {
      let publicAdvisory = getPublicAdvisory(
        publicAdvisories,
        protectedArea.ORCS
      );

      let regionName = null;
      let sectionName = null;
      let managementAreaName = null;
      if (protectedArea.ManagementAreas.length > 0) {
        const regionId = protectedArea.ManagementAreas[0].Region;
        if (regionId)
          regionName = regions.filter((x) => x.id === regionId)[0].RegionName;

        const sectionId = protectedArea.ManagementAreas[0].Section;
        if (sectionId)
          sectionName = sections.filter((x) => x.id === sectionId)[0]
            .SectionName;

        managementAreaName =
          protectedArea.ManagementAreas[0].ManagementAreaName;
      }

      let fireZoneName = null;
      let fireCentreName = null;
      if (protectedArea.FireZones.length > 0) {
        fireZoneName = protectedArea.FireZones[0].FireZoneName;
        const fireCentreId = protectedArea.FireZones[0].fire_centre;
        if (fireCentreId)
          fireCentreName = fireCentres.filter((x) => x.id === fireCentreId)[0]
            .FireCentreName;
      }

      const parkStatus = {
        orcsPrimary: protectedArea.ORCS,
        orcsSecondary: null,
        protectedLandsName: protectedArea.ProtectedAreaName,
        protectedLandsDesignation: protectedArea.Type,
        protectedLandsCode: protectedArea.TypeCode,
        accessStatus: publicAdvisory.AccessStatus,
        accessDetails: publicAdvisory.AdvisoryTitle,
        reservationsAffectedInd: publicAdvisory.ReservationsAffected,
        eventType: publicAdvisory.EventType,
        facilitiesCampfiresInd: getCampfireFacility(protectedArea.Facilities),
        campfireBanInd: hasCampfireBans,
        accessStatusEffectiveDate: protectedArea.EffectiveDate,
        accessStatusRescindedDate: publicAdvisory.ORCS,
        campfireBanEffectiveDate: null,
        campfireBanRescindedDate: null,
        fireCentreName: fireCentreName,
        fireZoneName: fireZoneName,
        fogZoneInd: protectedArea.FogZone,
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

      return parkStatus;
    });
  },
};
