const { indexPark, removePark } = require("../helpers/taskQueue.js");

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

const pageActions = ["create", "update", "delete", "publish", "unpublish"];

// Helper function to handle connect/disconnect logic
const handleConnectOrDisconnect = async (documentId) => {
  if (!documentId) return;
  const pa = await strapi.documents(protectedAreaCollectionType).findOne({
    documentId,
    fields: ["orcs"],
  });
  if (pa?.orcs) {
    strapi.log.info(`queuing park ${pa.orcs} for indexing...`);
    await indexPark(pa.orcs);
  }
};

// The middleware function
const searchIndexingMiddleware = (strapi) => {
  return async (context, next) => {
    // Early return if the document type or action is not relevant for indexing
    if (
      (context.uid !== protectedAreaCollectionType &&
        photoCollectionType !== context.uid &&
        !relatedCollectionTypes.includes(context.uid)) ||
      !pageActions.includes(context.action)
    ) {
      return await next(); // Call the next middleware in the stack
    }

    strapi.log.info(
      `Search indexing middleware trigered: ${context.uid}, action: ${context.action}`,
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
        });
      }
      // if we have the orcs, queue the park for indexing or removal from index
      const orcs = data?.orcs;
      if (orcs) {
        if (context.action === "delete" || context.action === "unpublish") {
          strapi.log.info(`queuing park ${orcs} for removal from index...`);
          await removePark(orcs);
        } else {
          strapi.log.info(`queuing park ${orcs} for indexing...`);
          await indexPark(orcs);
        }
      }
    }

    // Handle public advisories
    if (context.uid === publicAdvisoryCollectionType) {
      // sometimes the protectedAreas are provided as part of the form data and sometimes
      // they are part of the database object. The code below handles both scenarios.

      // scenario 1: part of the form data
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
      } else {
        // scenario 2: part of the existing database object
        const protectedAreas = context.params.data?.protectedAreas || {
          connect: [],
          disconnect: [],
        };

        for (const doc of protectedAreas.connect || []) {
          await handleConnectOrDisconnect(doc?.documentId);
        }

        for (const doc of protectedAreas.disconnect || []) {
          await handleConnectOrDisconnect(doc?.documentId);
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
            fields: ["documentId"],
            populate: { protectedArea: { fields: ["orcs"] } },
          });
          if (document?.protectedArea?.orcs) {
            const orcs = document.protectedArea.orcs;
            strapi.log.info(`queuing park ${orcs} for indexing...`);
            await indexPark(orcs);
          }
        }
      }
    }

    return await next(); // Call the next middleware in the stack
  };
};

module.exports = { searchIndexingMiddleware };
