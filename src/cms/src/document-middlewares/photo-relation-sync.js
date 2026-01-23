// Middleware to denormalize ORCS and orcsSiteNumber in park-photo records
// This is a legacy pattern from the initial implementation that avoided proper joins.
// When a photo is linked to a protected-area, it populates the orcs field.
// When a photo is linked to a site, it populates the orcsSiteNumber field.
// This allows direct querying of photos by ORCS/site number without joining related tables.

const pageActions = ["create", "update"];
const photoCollectionType = "api::park-photo.park-photo";

async function syncRelatedIdentifiers(data, strapi) {
  let recordInstance = {};

  // fetch existing record if documentId is present
  if (data.documentId) {
    recordInstance =
      (await strapi.documents(photoCollectionType).findOne({
        documentId: data.documentId,
        populate: "*",
        status: data.status,
      })) || {};
  }

  // get protected area (if applicable)
  const paDocumentId = data.protectedArea?.connect?.[0]?.documentId;
  const protectedArea = paDocumentId
    ? await strapi.documents("api::protected-area.protected-area").findOne({
        documentId: paDocumentId,
        fields: ["orcs"],
      })
    : recordInstance?.protectedArea;

  // get site (if applicable)
  const siteDocumentId = data.site?.connect?.[0]?.documentId;
  const site = siteDocumentId
    ? await strapi.documents("api::site.site").findOne({
        documentId: siteDocumentId,
        fields: ["orcsSiteNumber"],
      })
    : recordInstance?.site;

  // sync orcs field - set if connected, clear if disconnected
  const disconnectingProtectedArea =
    data.protectedArea?.connect?.length <
    data.protectedArea?.disconnect?.length;

  if (protectedArea && !disconnectingProtectedArea) {
    data.orcs = String(protectedArea.orcs);
  } else {
    data.orcs = null;
  }

  // sync orcsSiteNumber field - set if connected, clear if disconnected
  const disconnectingSite =
    data.site?.connect?.length < data.site?.disconnect?.length;

  if (site && !disconnectingSite) {
    data.orcsSiteNumber = site.orcsSiteNumber;
  } else {
    data.orcsSiteNumber = null;
  }

  return data;
}

// The middleware function
const photoRelationSyncMiddleware = (strapi) => {
  return async (context, next) => {
    if (
      context.uid !== photoCollectionType ||
      !pageActions.includes(context.action)
    ) {
      return await next(); // Call the next middleware in the stack
    }

    await syncRelatedIdentifiers(context.params.data, strapi);

    return await next(); // Call the next middleware in the stack
  };
};

module.exports = photoRelationSyncMiddleware;
