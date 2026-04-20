/**
 * Parses the incoming request payload to collect a unique list of impacted related documentIds
 * for a specified relation field. Handles multiple input formats, including arrays of strings,
 * arrays of objects, and objects with `connect`, `disconnect`, or `set` arrays.
 *
 * For update and delete actions, this helper also fetches existing related documentIds for both
 * draft and published states to ensure all impacted documents are captured, unless the action is
 * an update with explicit `connect` or `disconnect` arrays. In those cases, only the documentIds
 * explicitly listed in the `connect` or `disconnect` arrays are impacted, and there is no need
 * to look up the existing relations prior to the update.
 */

module.exports = async function getImpactedRelations({
  mainDocumentUid,
  relationFieldName,
  data,
  documentId,
  action,
}) {
  const value = data?.[relationFieldName];
  const impacted = new Set();

  if (value && Array.isArray(value)) {
    // for multiple relations provided as an array of strings or objects with documentIds
    // example formats:
    // - "protectedAreas": ["k8dmbeytobxmclbqnq2mbe4e", "j9dereyfobxghlbqnq2mge4f"]
    // - "protectedAreas": [{ documentId: "k8dmbeytobxmclbqnq2mbe4e" },
    //                      { documentId: "j9dereyfobxghlbqnq2mge4f" }]

    for (const item of value) {
      const docId = extractDocumentId(item);
      if (docId) {
        impacted.add(docId);
      }
    }
  } else if (
    value &&
    (typeof value === "object" || typeof value === "string")
  ) {
    // for relations provided as an object
    if (
      Array.isArray(value.set) ||
      Array.isArray(value.connect) ||
      Array.isArray(value.disconnect)
    ) {
      // object using connect/disconnect/set format
      // example formats (not exhaustive):
      // - "protectedAreas": { connect: ["k8dmbeytobxmclbqnq2mbe4e", "j9dereyfobxghlbqnq2mge4f"] }
      // - "protectedAreas": { connect:[{ documentId: "k8dmbeytobxmclbqnq2mbe4e" },
      //                              { documentId: "j9dereyfobxghlbqnq2mge4f" }] }
      // - "protectedArea": { disconnect: [{ documentId: "k8dmbeytobxmclbqnq2mbe4e" }] }
      // - "protectedArea": { set: ["k8dmbeytobxmclbqnq2mbe4e"] }

      if (Array.isArray(value.connect)) {
        for (const item of value.connect) {
          const docId = extractDocumentId(item);
          if (docId) {
            impacted.add(docId);
          }
        }
      }
      if (Array.isArray(value.disconnect)) {
        for (const item of value.disconnect) {
          const docId = extractDocumentId(item);
          if (docId) {
            impacted.add(docId);
          }
        }
      }
      if (Array.isArray(value.set)) {
        for (const item of value.set) {
          const docId = extractDocumentId(item);
          if (docId) {
            impacted.add(docId);
          }
        }
      }
    } else {
      // other objects or plain string format
      // example formats:
      // - "protectedArea": "k8dmbeytobxmclbqnq2mbe4e"
      // - "protectedArea": { documentId: "k8dmbeytobxmclbqnq2mbe4e" }

      if (typeof value === "string") {
        impacted.add(value);
      } else if (
        value &&
        typeof value === "object" &&
        typeof value.documentId === "string"
      ) {
        impacted.add(value.documentId);
      }
    }
  }

  if (action !== "create" && documentId) {
    // examples (not exhaustive):
    // - DELETE /api/park-activities/k8dmbeytobxmclbqnq2mbe4e
    // - PUT /api/park-activities/k8dmbeytobxmclbqnq2mbe4e

    if (action !== "update" || (!value?.connect && !value?.disconnect)) {
      // exclude update actions that have explicit connect/disconnect arrays,
      // since those already specify the impacted documentIds and there is no
      // need to look up existing relations

      for (const docId of await getExistingRelatedDocIds({
        mainDocumentUid,
        relationFieldName,
        documentId,
      })) {
        impacted.add(docId);
      }
    }
  }

  return Array.from(impacted);
};

// HELPER FUNCTIONS

// This function fetches existing related documentIds for both draft and published
// states to ensure we capture all impacted documents during updates or deletions.
async function getExistingRelatedDocIds({
  mainDocumentUid,
  relationFieldName,
  documentId,
}) {
  const impacted = new Set();

  for (const docId of await getExistingRelatedDocIdsByStatus({
    mainDocumentUid,
    relationFieldName,
    documentId,
    status: "draft",
  })) {
    impacted.add(docId);
  }

  for (const docId of await getExistingRelatedDocIdsByStatus({
    mainDocumentUid,
    relationFieldName,
    documentId,
    status: "published",
  })) {
    impacted.add(docId);
  }

  return Array.from(impacted);
}

// This function fetches existing related documentIds for a specific publication status.
async function getExistingRelatedDocIdsByStatus({
  mainDocumentUid,
  relationFieldName,
  documentId,
  status,
}) {
  try {
    const current = await strapi.documents(mainDocumentUid).findOne({
      documentId,
      status: status,
      fields: ["documentId"],
      populate: { [relationFieldName]: { fields: ["documentId"] } },
    });

    const rel = current?.[relationFieldName];
    if (Array.isArray(rel)) {
      return rel.map((r) => r?.documentId).filter(Boolean);
    } else if (rel && typeof rel === "object" && rel.documentId) {
      return [rel.documentId];
    }
  } catch (error) {
    strapi.log.warn(
      `Failed to fetch existing relations for ${mainDocumentUid} documentId ${documentId} and relation field ${relationFieldName}`,
      { error }
    );
  }

  return [];
}

// This helper function extracts a documentId from various possible formats
// of relation inputs.
function extractDocumentId(item) {
  if (typeof item === "string") {
    // e.g. "k8dmbeytobxmclbqnq2mbe4e"
    return item;
  }
  if (item && typeof item === "object" && typeof item.documentId === "string") {
    // e.g. { documentId: "k8dmbeytobxmclbqnq2mbe4e" }
    return item.documentId;
  }
  return null;
}
