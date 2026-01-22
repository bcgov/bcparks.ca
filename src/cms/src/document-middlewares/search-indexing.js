const { indexPark, removePark } = require("../helpers/taskQueue.js");

const protectedAreaCollectionType = "api::protected-area.protected-area";
const photoCollectionType = ["api::park-photo.park-photo"];
const relatedCollectionTypes = [
  "api::park-camping-type.park-camping-type",
  "api::park-facility.park-facility",
  "api::park-activity.park-activity",
  "api::park-name.park-name",
  "api::park-feature.park-feature",
  "api::public-advisory.public-advisory",
  "api::geo-shape.geo-shape",
  "api::park-date.park-date",
];

const pageActions = ["create", "update", "delete"];

// Helper function to handle connect/disconnect logic
const handleConnectOrDisconnect = async (documentId) => {
  if (!documentId) return;
  const pa = await strapi.documents(protectedAreaCollectionType).findOne({
    documentId,
    fields: ["orcs"],
  });
  if (pa?.orcs) {
    await indexPark(pa.orcs);
  }
};

// The middleware function
const searchIndexingMiddleware = () => {
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

    // Handle protectedAreas and parkPhotos
    if (
      context.uid === protectedAreaCollectionType ||
      context.uid === photoCollectionType
    ) {
      const orcs = context.params.data?.orcs;
      if (orcs) {
        if (context.action === "delete") {
          await removePark(orcs);
        } else {
          await indexPark(orcs);
        }
      }
    }

    // Handle other realatedCollectionTypes
    if (relatedCollectionTypes.includes(context.uid)) {
      const connectParkDocId =
        context.params.data.protectedArea?.connect?.[0]?.documentId;
      const disconnectParkDocId =
        context.params.data.protectedArea?.disconnect?.[0]?.documentId;

      if (connectParkDocId || disconnectParkDocId) {
        // this is for cases where the protected area relation is being changed
        await handleConnectOrDisconnect(connectParkDocId);
        await handleConnectOrDisconnect(disconnectParkDocId);
      } else {
        // this is for cases where the record is already in the db and the
        // protected area relation is not being changed
        const documentId = context.params?.documentId;
        const document = await strapi.documents(context.uid).findOne({
          documentId,
          fields: ["documentId"],
          populate: { protectedArea: { fields: ["orcs"] } },
        });
        if (document.protectedArea?.orcs) {
          await indexPark(document.protectedArea.orcs);
        }
      }
    }

    const result = await next(); // Call the next middleware in the stack

    return result; // Return the result of the middleware chain
  };
};

module.exports = { searchIndexingMiddleware };
