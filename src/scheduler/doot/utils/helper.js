const { cmsAxios } = require("../../shared/axiosConfig");

// get the protectedAreaId, parkAreaId, and parkFeatureId for a DOOT
// queued task item
async function getEntityIds(item) {
  let protectedAreaId, parkAreaId, parkFeatureId, relationName;

  if (item.orcsFeatureNumber) {
    parkFeatureId = await getParkFeatureId(item.orcsFeatureNumber);
    relationName = `feature:${item.orcsFeatureNumber}`;
  } else if (item.orcsAreaNumber) {
    parkAreaId = await getParkAreaId(item.orcsAreaNumber);
    relationName = `area:${item.orcsAreaNumber}`;
  } else if (item.orcs) {
    protectedAreaId = await getProtectedAreaId(item.orcs);
    relationName = `park:${item.orcs}`;
  }

  return { protectedAreaId, parkAreaId, parkFeatureId, relationName };
}

// get the Strapi ID for a park feature based on the orcsFeatureNumber
async function getParkFeatureId(orcsFeatureNumber) {
  const params = {
    filters: { orcsFeatureNumber },
    fields: ["id"],
  };
  const response = await cmsAxios.get("/api/park-features", { params });
  if (response.data.data.length > 0) {
    return response.data.data[0].id;
  }
  return undefined;
}

// get the Strapi ID for a park area based on the orcsAreaNumber
async function getParkAreaId(orcsAreaNumber) {
  const params = {
    filters: { orcsAreaNumber },
    fields: ["id"],
  };
  const response = await cmsAxios.get("/api/park-areas", { params });
  if (response.data.data.length > 0) {
    return response.data.data[0].id;
  }
  return undefined;
}

// get the Strapi ID for a protected area based on the orcs
async function getProtectedAreaId(orcs) {
  const params = {
    filters: { orcs },
    fields: ["id"],
  };
  const response = await cmsAxios.get("/api/protected-areas", { params });
  if (response.data.data.length > 0) {
    return response.data.data[0].id;
  }
  return undefined;
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

// Get all park-gates IDs matching the provided entity IDs.
// Returns an array of IDs.
async function getParkGateIds(protectedAreaId, parkAreaId, parkFeatureId) {
  const gateParams = {
    filters: {
      protectedArea: protectedAreaId ? { id: protectedAreaId } : undefined,
      parkArea: parkAreaId ? { id: parkAreaId } : undefined,
      parkFeature: parkFeatureId ? { id: parkFeatureId } : undefined,
    },
    fields: ["id"],
  };
  let gateResponse;
  try {
    gateResponse = await cmsAxios.get("/api/park-gates", { params: gateParams });
  } catch (error) {
    throw new Error(`getParkGateIds() failed while retrieving park-gates: ${error}`);
  }
  return gateResponse.data.data.map((gate) => gate.id);
}

module.exports = { getEntityIds, getDateTypeMap, getParkGateIds };
