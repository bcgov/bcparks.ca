/**
 *  PHOTO RELATION SYNC (Document Services Middleware)
 *  Stores `orcs` and `orcsSiteNumber` on park-photo records for backward
 *  compatibility
 */

// CONFIGURATION

const pageActions = ["create", "update"];
const photoCollectionType = "api::park-photo.park-photo";

// MAIN MIDDLEWARE FUNCTION (scaffolding)

module.exports = () => {
  return async (context, next) => {
    if (
      context.uid !== photoCollectionType ||
      !pageActions.includes(context.action)
    ) {
      return await next(); // Call the next middleware in the stack
    }

    strapi.log.info(
      `photoRelationSyncMiddleware ${context.uid}-${context.action}`,
    );
    await syncRelatedIdentifiers(context.params.data, strapi);

    return await next(); // Call the next middleware in the stack
  };
};

// HELPER FUNCTIONS

// This is the main workhorse function that handles the logic of syncing
// related identifiers based on connected/disconnected relations
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
        status: "published",
        fields: ["orcs"],
      })
    : recordInstance?.protectedArea;

  // get site (if applicable)
  const siteDocumentId = data.site?.connect?.[0]?.documentId;
  const site = siteDocumentId
    ? await strapi.documents("api::site.site").findOne({
        documentId: siteDocumentId,
        status: "published",
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
