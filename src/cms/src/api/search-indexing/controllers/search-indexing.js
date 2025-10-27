'use strict';

const { sanitize } = require('@strapi/utils');

module.exports = ({ strapi }) => ({

  getParksForIndexing: async (ctx) => {
    const contentType = strapi.contentType("api::protected-area.protected-area");
    const query = await sanitize.contentAPI.query(ctx.query, contentType, {});

    query.fields = [
      "orcs",
      "protectedAreaName",
      "searchTerms",
      "marineProtectedArea",
      "typeCode",
      "hasCampfireBan",
      "slug",
      "latitude",
      "longitude",
      "isDisplayed",
      "publishedAt"
    ];
    query.populate = {
      parkNames: {
        fields: ["parkName"],
        populate: { "parkNameType": { fields: ["nameTypeId"] } }
      },
      parkFacilities: {
        fields: ["isFacilityOpen", "isActive", "publishedAt"],
        populate: {
          "facilityType": {
            fields: ["facilityCode", "isActive", "facilityNumber"]
          }
        }
      },
      parkActivities: {
        fields: ["isActivityOpen", "isActive", "publishedAt"],
        populate: {
          "activityType": {
            fields: ["activityCode", "isActive", "activityNumber"]
          }
        }
      },
      parkCampingTypes: {
        fields: ["isCampingOpen", "isActive", "publishedAt"],
        populate: {
          "campingType": {
            fields: ["campingTypeCode", "isActive", "campingTypeNumber"]
          }
        }
      },
      managementAreas: {
        fields: ["managementAreaNumber", "managementAreaName"],
        populate: {
          "searchArea": {
            fields: ["searchAreaName"],
          },
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
      },
      geoShape: {
        fields: ["geometry"],
      },
      // TODO: CMS-1206 Replace with parkDates
      parkOperationDates: {
        fields: ["operatingYear", "gateOpenDate", "gateCloseDate", "publishedAt"]
      },
      // TODO: CMS-1206 Replace with parkFeatures and parkDates
      parkOperationSubAreas: {
        fields: ["isActive", "isOpen", "closureAffectsAccessStatus", "publishedAt"],
        populate: {
          "parkOperationSubAreaDates": {
            fields: ["operatingYear", "openDate", "closeDate", "isActive", "publishedAt"]
          },
          "parkSubAreaType": {
            fields: ["id"]
          }
        }
      },
      parkDates: {
        fields: ["operatingYear", "startDate", "endDate", "publishedAt"],
        populate: {
          "parkDateType": {
            fields: ["dateType"]
          }
        },
        filters: {
          parkDateType: {
            dateType: {
              $eq: "Gate"
            }
          }
        }
      },
      parkAreas: {
        fields: ["isActive", "isOpen", "closureAffectsAccessStatus", "publishedAt"],
        populate: {
          "parkAreaType": {
            fields: ["id"]
          }
        }
      },
      parkFeatures: {
        fields: ["isActive", "isOpen", "closureAffectsAccessStatus", "publishedAt"],
        populate: {
          "parkDates": {
            fields: ["operatingYear", "startDate", "endDate", "isActive", "publishedAt"],
            populate: {
              "parkDateType": {
                fields: ["dateType"]
              }
            },
            filters: {
              parkDateType: {
                dateType: {
                  $eq: "Gate"
                }
              }
            }
          },
          "parkFeatureType": {
            fields: ["id"]
          }
        }
      }
    };
    query.publicationState = "preview";

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
