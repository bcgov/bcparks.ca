const { cmsAxios } = require("../../shared/axiosConfig");

// get the protectedAreaId, parkAreaId, and parkFeatureId for a DOOT
// queued task item
async function getEntityIds(item) {
  let protectedAreaId = null;
  let parkAreaId = null;
  let parkFeatureId = null;

  if (item.orcsFeatureNumber) {
    // use the Strapi API to get the parkFeature by orcsFeatureNumber
    let parkFeature;
    const params = {
      filters: { orcsFeatureNumber: item.orcsFeatureNumber },
      fields: ["id"],
    };
    // use cmsAxios to call the Strapi API with the Authorization header
    const response = await cmsAxios.get("/api/park-features", { params });
    if (response.data.data.length > 0) {
      parkFeature = response.data.data[0];
      parkFeatureId = parkFeature.id;
    }
  } else if (item.orcsAreaNumber) {
    // use the Strapi API to get the parkArea by orcsAreaNumber
    let parkArea;
    const params = {
      filters: { orcsAreaNumber: item.orcsAreaNumber },
      fields: ["id"],
    };
    // use cmsAxios to call the Strapi API with the Authorization header
    const response = await cmsAxios.get("/api/park-areas", { params });
    if (response.data.data.length > 0) {
      parkArea = response.data.data[0];
      parkAreaId = parkArea.id;
    }
  } else if (item.orcs) {
    // use the Strapi API to get the protectedArea by orcs
    let protectedArea;
    const params = {
      filters: { orcs: item.orcs },
      fields: ["id"],
    };
    // use cmsAxios to call the Strapi API with the Authorization header
    const response = await cmsAxios.get("/api/protected-areas", { params });
    if (response.data.data.length > 0) {
      protectedArea = response.data.data[0];
      protectedAreaId = protectedArea.id;
    }
  }

  return { protectedAreaId, parkAreaId, parkFeatureId };
}

// get a map of dateTypeId to Strapi ID
async function getDateTypeMap() {
  const dateTypeMap = new Map();
  let dateTypesResponse;
  dateTypesResponse = await cmsAxios.get("/api/park-date-types");
  for (const dateType of dateTypesResponse.data.data) {
    dateTypeMap.set(dateType.attributes.dateTypeId, dateType.id);
  }
  return dateTypeMap;
}

module.exports = { getEntityIds, getDateTypeMap };
