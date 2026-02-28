/**
 *  SEARCH INDEXING (Document Services Middleware)
 *  Queues jobs to refresh the search index when relevant park data changes
 */

const { indexPark, removePark } = require("../helpers/taskQueue.js");

// CONFIGURATION

const protectedAreaCollectionType = "api::protected-area.protected-area";
const photoCollectionType = "api::park-photo.park-photo";
const publicAdvisoryCollectionType = "api::public-advisory.public-advisory";
const relatedCollectionTypes = [
  "api::park-camping-type.park-camping-type",
  "api::park-facility.park-facility",
  "api::park-activity.park-activity",
  "api::park-name.park-name",
  "api::park-feature.park-feature",
  "api::geo-shape.geo-shape",
  "api::park-date.park-date",
];
const allRelevantCollections = [
  protectedAreaCollectionType,
  photoCollectionType,
  publicAdvisoryCollectionType,
  ...relatedCollectionTypes,
];

const pageActions = ["create", "update", "delete", "publish", "unpublish"];

// MAIN MIDDLEWARE FUNCTION

module.exports = () => {
  return async (context, next) => {
    // Early return if the document type or action is not relevant for indexing
    if (
      !allRelevantCollections.includes(context.uid) ||
      !pageActions.includes(context.action)
    ) {
      return await next(); // Call the next middleware in the stack
    }

    strapi.log.info(
      `searchIndexingMiddleware ${context.uid}-${context.action}`,
    );

    // Handle protectedAreas and parkPhotos
    if (
      context.uid === protectedAreaCollectionType ||
      context.uid === photoCollectionType
    ) {
      // ensure we have the data so we can get the orcs
      let data = context.params.data;
      if (!data) {
        data = await strapi.documents(context.uid).findOne({
          documentId: context.params.documentId,
          fields: ["orcs"],
          status: "published",
        });
      }
      // if we have the orcs, queue the park for indexing or removal from index
      const orcs = data?.orcs;
      if (orcs) {
        if (context.action === "delete" || context.action === "unpublish") {
          await removePark(orcs);
        } else {
          await indexPark(orcs);
        }
      }
    }

    // Handle public advisories
    if (context.uid === publicAdvisoryCollectionType) {
      // sometimes the protectedAreas are included in the data, sometimes not.
      // If not, we need to fetch the advisory to get them. The code below handles
      // all scenarios.

      // scenario 1: connect or disconnect
      const connectParks = context.params.data?.protectedAreas?.connect || [];
      const disconnectParks =
        context.params.data?.protectedAreas?.disconnect || [];

      if (connectParks.length || disconnectParks.length) {
        for (const park of connectParks) {
          await handleConnectOrDisconnect(park.documentId);
        }
        for (const park of disconnectParks) {
          await handleConnectOrDisconnect(park.documentId);
        }
      } else if (Array.isArray(context.params.data?.protectedAreas)) {
        // scenario 2: protected areas are directly included in the data
        const parks = context.params.data?.protectedAreas || [];
        if (parks.length) {
          for (const park of parks) {
            const orcs = park?.orcs;
            if (orcs) {
              await indexPark(orcs);
            }
          }
        }
      } else if (context.params?.documentId) {
        // scenario 3: fallback – lookup advisory by documentId when protectedAreas are not in the payload
        const advisoryDocId = context.params?.documentId;
        const advisory = await strapi.documents(context.uid).findOne({
          documentId: advisoryDocId,
          fields: ["documentId"],
          status: "published",
          populate: { protectedAreas: { fields: ["orcs"] } },
        });
        const protectedAreas = advisory?.protectedAreas || [];
        for (const park of protectedAreas) {
          const orcs = park?.orcs;
          if (orcs) {
            await indexPark(orcs);
          }
        }
      }
    }

    // Handle other realatedCollectionTypes
    if (relatedCollectionTypes.includes(context.uid)) {
      const connectParkDocId =
        context?.params?.data?.protectedArea?.connect?.[0]?.documentId;
      const disconnectParkDocId =
        context?.params?.data?.protectedArea?.disconnect?.[0]?.documentId;

      if (connectParkDocId || disconnectParkDocId) {
        // this is for cases where the protected area relation is being changed
        await handleConnectOrDisconnect(connectParkDocId);
        await handleConnectOrDisconnect(disconnectParkDocId);
      } else {
        // this is for cases where the record is already in the db and the
        // protected area relation is not being changed
        const documentId = context.params?.documentId;

        // documentId is not available in draft
        if (documentId) {
          const document = await strapi.documents(context.uid).findOne({
            documentId,
            status: "published",
            fields: ["documentId"],
            populate: { protectedArea: { fields: ["orcs"] } },
          });
          if (document?.protectedArea?.orcs) {
            const orcs = document.protectedArea.orcs;
            await indexPark(orcs);
          }
        }
      }
    }

    return await next(); // Call the next middleware in the stack
  };
};

// HELPER FUNCTIONS

// Handles orcs lookup and triggers indexing for related collections.
async function handleConnectOrDisconnect(documentId) {
  if (!documentId) return;
  const pa = await strapi.documents(protectedAreaCollectionType).findOne({
    documentId,
    status: "published",
    fields: ["orcs"],
  });
  if (pa?.orcs) {
    await indexPark(pa.orcs);
  }
}
