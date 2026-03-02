/**
 * Document Service middleware helper function to parse the incoming request
 * payload and collect a unique list of impacted related documentIds for a
 * specified relation field.
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
    // for multiple relations provided as an array of objects with documentIds
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
    if (action !== "update" || (!value?.connect && !value?.disconnect)) {
      // note: `delete` always ends up with two tasks in the queue because
      // the middleware runs for both the draft and published versions of the document
      // just ignore the duplicates and let the scheduler handle it.
      // The `update` and `publish` combo behaves similarly because there are two actions
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
      { error },
    );
  }

  return [];
}

// This helper function extracts a documentId from various possible formats
// of relation inputs.
function extractDocumentId(item) {
  if (typeof item === "string") {
    return item;
  }
  if (item && typeof item === "object" && typeof item.documentId === "string") {
    return item.documentId;
  }
  return null;
}
