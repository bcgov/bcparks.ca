/**
 *  SEARCH INDEXING (Document Services Middleware)
 *  Queues jobs to refresh the search index when relevant park data changes
 */

const {
  indexPark,
  removePark,
  batchQueueParks,
} = require("../helpers/taskQueue.js");
const getImpactedRelations = require("./helpers/getImpactedRelations.js");

// CONFIGURATION

// any collection that has data cloned in the Elasticsearch index should
// be listed here so that we can trigger re-indexing of the relevant parks
// when that data changes. (excluding lookup tables which rarely change)
const protectedAreaCollectionType = "api::protected-area.protected-area";
const photoCollectionType = "api::park-photo.park-photo";
const publicAdvisoryCollectionType = "api::public-advisory.public-advisory";
const parkDateCollectionType = "api::park-date.park-date";
const otherRelatedCollectionTypes = [
  "api::geo-shape.geo-shape",
  "api::park-activity.park-activity",
  "api::park-camping-type.park-camping-type",
  "api::park-facility.park-facility",
  "api::park-feature.park-feature",
  "api::park-name.park-name",
];
const allRelevantCollections = [
  protectedAreaCollectionType,
  photoCollectionType,
  publicAdvisoryCollectionType,
  parkDateCollectionType,
  ...otherRelatedCollectionTypes,
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
        if (
          context.uid == protectedAreaCollectionType &&
          (context.action === "delete" || context.action === "unpublish")
        ) {
          await removePark(orcs);
        } else {
          await indexPark(orcs);
        }
      }
    }

    // Handle park dates
    if (context.uid === parkDateCollectionType) {
      let linkedParksBefore = await getDateRelations(context.params.documentId);
      const result = await next();
      let linkedParksAfter = await getDateRelations(result.documentId);

      // Combine and deduplicate the impacted parks before and after the change
      const impactedParks = [
        ...new Set([...linkedParksBefore, ...linkedParksAfter]),
      ];

      await batchQueueParks(Array.from(impactedParks));

      return result;
    }

    // Handle public advisories
    if (context.uid === publicAdvisoryCollectionType) {
      const impactedParks = await getImpactedRelations({
        mainDocumentUid: context.uid,
        relationFieldName: "protectedAreas",
        data: context.params.data,
        documentId: context.params.documentId,
        action: context.action,
      });
      await batchQueueParks(impactedParks);
    }

    // Handle other realated collection types
    if (otherRelatedCollectionTypes.includes(context.uid)) {
      const impactedParks = await getImpactedRelations({
        mainDocumentUid: context.uid,
        relationFieldName: "protectedArea",
        data: context.params.data,
        documentId: context.params.documentId,
        action: context.action,
      });
      await batchQueueParks(impactedParks);
    }

    return await next();
  };
};

// HELPER FUCTIONS

async function getDateRelations(documentId) {
  if (!documentId) {
    return [];
  }
  const parkDate = await strapi.documents(parkDateCollectionType).findOne({
    documentId: documentId,
    fields: ["documentId"],
    populate: {
      protectedArea: {
        fields: ["documentId"],
      },
      parkFeature: {
        fields: ["documentId"],
        populate: {
          protectedArea: {
            fields: ["documentId"],
          },
        },
      },
    },
    status: "published",
  });

  return [
    parkDate?.protectedArea?.orcs,
    parkDate?.parkFeature?.protectedArea?.orcs,
  ].filter(Boolean);
}
