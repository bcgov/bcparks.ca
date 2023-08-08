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
        fields: ["managementAreaName"],
        populate: {
          "section": {
            fields: ["sectionName"],
            populate: { "region": { fields: ["regionName"] } }
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

  searchParks: async (ctx) => {

    const filters = parseSearchFilters(ctx.query);
    const offset = parseSearchOffset(ctx.query);

    try {
      const resp = await strapi.service("api::search.search").searchParks({
        ...filters,
        ...offset,
      });

      const result = resp?.body?.hits;

      if (result?.hits) {
        const filteredMatches = result.hits;

        const data = filteredMatches.map((data) => {
          return data['_source'];
        });

        return {
          data: data,
          meta: {
            pagination: {
              page: 1,
              pageSize: 10,
              pageCount: Math.ceil(result.total?.value / 10),
              total: result.total?.value
            },
            aggregations: resp?.body?.aggregations
          }
        };
      }
      else {
        ctx.body = {
          data: [],
          meta: {
            pagination: {
              page: 1,
              pageSize: 10,
              pageCount: 0,
              total: 0
            },
            aggregations: {}
          }
        }
      }
    } catch (err) {
      ctx.response.status = 500;
      ctx.body = "An error was encountered while processing the search request."
      console.log('An error was encountered while processing the search request.')
      console.log(err);
    }
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
        .service("api::search.search")
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

function parseSearchFilters(query) {
  const searchText = query.queryText;
  const typeCode = query.typeCode || query.typeCode_eq;
  const accessStatus = query.accessStatus || query.accessStatus_eq;
  const marineProtectedArea =
    query.marineProtectedArea || query.marineProtectedArea_eq;
  const camping =
    query.camping &&
    (query.camping.toLowerCase() === "true" ||
      query.camping.toLowerCase() === "y");

  let activityTypeIds = [];
  let facilityTypeIds = [];

  if (query.activities) {
    if (typeof query.activities === "object") {
      activityTypeIds = query.activities.map((activityId) =>
        parseInt(activityId, 10)
      );
    } else {
      activityTypeIds = [parseInt(query.activities, 10)];
    }
  }
  if (query.facilities) {
    if (typeof query.facilities === "object") {
      facilityTypeIds = query.facilities.map((facilityId) =>
        parseInt(facilityId, 10)
      );
    } else {
      facilityTypeIds = [parseInt(query.facilities, 10)];
    }
  }

  return {
    searchText,
    typeCode,
    accessStatus,
    camping,
    marineProtectedArea,
    activityTypeIds,
    facilityTypeIds,
  };
}

function parseSearchOffset(query) {
  const offset = parseInt(query._start, 10) || 0;
  const limit = parseInt(query._limit, 10) || 10;

  return {
    limit,
    offset,
  };
}
