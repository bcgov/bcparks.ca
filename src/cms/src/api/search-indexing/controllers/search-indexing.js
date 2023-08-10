'use strict';

const { sanitize } = require('@strapi/utils');

module.exports = ({ strapi }) => ({

  getParksForIndexing: async (ctx) => {
    const contentType = strapi.contentType("api::protected-area.protected-area");
    const query = await sanitize.contentAPI.query(ctx.query, contentType, {});

    query.fields = [
      "orcs",
      "protectedAreaName",
      "marineProtectedArea",
      "typeCode",
      "hasCampfireBan",
      "slug",
      "isDisplayed",
      "publishedAt"
    ];
    query.populate = {
      parkNames: {
        fields: ["parkName"],
        populate: { "parkNameType": { fields: ["nameTypeId"] } }
      },
      parkFacilities: {
        fields: ["isFacilityOpen", "isActive"],
        populate: {
          "facilityType": {
            fields: ["facilityCode", "isActive", "isCamping", "facilityNumber"]
          }
        }
      },
      parkActivities: {
        fields: ["isActivityOpen", "isActive"],
        populate: {
          "activityType": {
            fields: ["activityCode", "isActive", "isCamping", "activityNumber"]
          }
        }
      },
      managementAreas: {
        fields: ["managementAreaNumber", "managementAreaName"],
        populate: {
          "section": {
            fields: ["sectionNumber", "sectionName"],
            populate: { "region": { fields: ["regionNumber", "regionName"] } }
          }
        }
      },
      publicAdvisories: {
        fields: ["id"],
        populate: {
          "accessStatus": { fields: ["id"] },
          "urgency": { fields: ["id"] },
          "advisoryStatus": { fields: ["id", "code"] }
        }
      }
    };

    const { results, pagination } = await strapi.service("api::protected-area.protected-area").find(query);

    return { data: results, meta: { pagination: pagination } };
  },

  getParkPhotosForIndexing: async (ctx) => {
    const contentType = strapi.contentType("api::park-photo.park-photo");
    const query = await sanitize.contentAPI.query(ctx.query, contentType, {});
    query.fields = ["orcs", "sortOrder", "imageUrl"];
    query.pagination = { limit: -1 };
    query.filters = { isActive: true, ...query.filters }
    const { results } = await strapi.service("api::park-photo.park-photo").find(query);
    return results;
  },

  queueAllParksForIndexing: async (ctx) => {
    try {
      await strapi
        .service("api::search-indexing.search-indexing")
        .queueAllParksForIndexing();
    } catch (error) {
      return ctx.internalServerError(
        "Error in service search:queueAllParksForIndexing()",
        error.message
      );
    }

    ctx.send({
      message: `Set all parks to be reindexed`
    }, 201);
  }
});
