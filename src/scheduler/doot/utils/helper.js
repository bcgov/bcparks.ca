const { cmsAxios } = require("../../shared/axiosConfig");

// get the protectedAreaDocId, parkAreaDocId, and parkFeatureDocId
// for a DOOT queued task item
async function getEntityDocIds(item) {
  let protectedAreaDocId, parkAreaDocId, parkFeatureDocId, relationName;

  if (item.orcsFeatureNumber) {
    parkFeatureDocId = await getParkFeatureDocId(item.orcsFeatureNumber);
    relationName = `feature:${item.orcsFeatureNumber}`;
  } else if (item.orcsAreaNumber) {
    parkAreaDocId = await getParkAreaDocId(item.orcsAreaNumber);
    relationName = `area:${item.orcsAreaNumber}`;
  } else if (item.orcs) {
    protectedAreaDocId = await getProtectedAreaDocId(item.orcs);
    relationName = `park:${item.orcs}`;
  }

  return { protectedAreaDocId, parkAreaDocId, parkFeatureDocId, relationName };
}

// get the Strapi documentId for a parkFeature based on the orcsFeatureNumber
async function getParkFeatureDocId(orcsFeatureNumber) {
  const params = {
    filters: { orcsFeatureNumber },
    fields: ["documentId"],
  };
  const response = await cmsAxios.get("/api/park-features", { params });
  if (response.data.data.length > 0) {
    return response.data.data[0].documentId;
  }
  return undefined;
}

// get the Strapi documentId for a parkArea based on the orcsAreaNumber
async function getParkAreaDocId(orcsAreaNumber) {
  const params = {
    filters: { orcsAreaNumber },
    fields: ["documentId"],
  };
  const response = await cmsAxios.get("/api/park-areas", { params });
  if (response.data.data.length > 0) {
    return response.data.data[0].documentId;
  }
  return undefined;
}

// get the Strapi documentId for a protected area based on the orcs
async function getProtectedAreaDocId(orcs) {
  const params = {
    filters: { orcs },
    fields: ["documentId"],
  };
  const response = await cmsAxios.get("/api/protected-areas", { params });
  if (response.data.data.length > 0) {
    return response.data.data[0].documentId;
  }
  return undefined;
}

// get a map of dateTypeId to Strapi documentId
async function getDateTypeMap() {
  const dateTypeMap = new Map();
  let dateTypesResponse;
  dateTypesResponse = await cmsAxios.get("/api/park-date-types");
  for (const dateType of dateTypesResponse.data.data) {
    dateTypeMap.set(dateType.dateTypeId, dateType.documentId);
  }
  return dateTypeMap;
}

// Get all park-gates documentIds matching the provided entity documentIds.
// Returns an array of documentIds.
async function getParkGateDocIds(protectedAreaDocId, parkAreaDocId, parkFeatureDocId) {
  const gateParams = {
    filters: {
      protectedArea: protectedAreaDocId ? { documentId: protectedAreaDocId } : undefined,
      parkArea: parkAreaDocId ? { documentId: parkAreaDocId } : undefined,
      parkFeature: parkFeatureDocId ? { documentId: parkFeatureDocId } : undefined,
    },
    fields: ["documentId"],
  };
  let gateResponse;
  try {
    gateResponse = await cmsAxios.get("/api/park-gates", { params: gateParams });
  } catch (error) {
    throw new Error(`getParkGateDocIds() failed while retrieving park-gates: ${error}`);
  }
  return gateResponse.data.data.map((gate) => gate.documentId);
}

// Try to get the orcs from the orcs, orcsAreaNumber or orcsFeatureNumber fields
function tryGetOrcs(item) {
  const wellKnownKey = item.orcs || item.orcsAreaNumber || item.orcsFeatureNumber;
  return wellKnownKey ? parseInt(wellKnownKey, 10) : undefined;
}

module.exports = { getEntityDocIds, getDateTypeMap, getParkGateDocIds, tryGetOrcs };
