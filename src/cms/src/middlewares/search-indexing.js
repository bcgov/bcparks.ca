/**
 *  SEARCH INDEXING (Document Services Middleware)
 *  Queues jobs to refresh the search index when relevant park data changes
 *
 *  NOTE: `delete` actions always result in two tasks in the queue because the middleware
 *  runs for both the draft and published versions of the document. Just ignore the
 *  duplicates and let the scheduler handle them. The `update` and `publish` combo
 *  has similar behavior because the update action runs separately from the publish action.
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

// multiple paths to protectedArea, nested 1-2 levels deep.
const nestedRelatedCollectionTypes = [
  "api::park-date.park-date",
  "api::park-gate.park-gate",
];

// single direct path to protectedArea, one level deep.
const otherRelatedCollectionTypes = [
  "api::geo-shape.geo-shape",
  "api::park-activity.park-activity",
  "api::park-camping-type.park-camping-type",
  "api::park-facility.park-facility",
  "api::park-feature.park-feature",
  "api::park-name.park-name",
  "api::park-area.park-area",
];

const allRelevantCollections = [
  protectedAreaCollectionType,
  photoCollectionType,
  publicAdvisoryCollectionType,
  ...nestedRelatedCollectionTypes,
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
          context.uid === protectedAreaCollectionType &&
          (context.action === "delete" || context.action === "unpublish")
        ) {
          await removePark(orcs);
        } else {
          await indexPark(orcs);
        }
      }
    }

    // Handle park dates and park gates
    if (nestedRelatedCollectionTypes.includes(context.uid)) {
      const relatedCollectionType = context.uid;
      const linkedParksBefore = await resolveNestedProtectedAreaDocumentIds(
        relatedCollectionType,
        context.params.documentId,
      );
      const result = await next();
      const linkedParksAfter = await resolveNestedProtectedAreaDocumentIds(
        relatedCollectionType,
        result.documentId,
      );

      // Combine and deduplicate the impacted parks before and after the change
      const impactedParks = [
        ...new Set([...linkedParksBefore, ...linkedParksAfter]),
      ];

      await batchQueueParks(impactedParks, context.uid, context.action);

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
      await batchQueueParks(impactedParks, context.uid, context.action);
    }

    // Handle other related collection types
    if (otherRelatedCollectionTypes.includes(context.uid)) {
      const impactedParks = await getImpactedRelations({
        mainDocumentUid: context.uid,
        relationFieldName: "protectedArea",
        data: context.params.data,
        documentId: context.params.documentId,
        action: context.action,
      });
      await batchQueueParks(impactedParks, context.uid, context.action);
    }

    return await next();
  };
};

// HELPER FUNCTIONS

// This function gets related protected areas for collections with multiple
// levels of relations to protected areas (e.g. park-date and park-gate)
async function resolveNestedProtectedAreaDocumentIds(
  collectionType,
  documentId,
) {
  if (!documentId) {
    return [];
  }

  const entry = await strapi.documents(collectionType).findOne({
    documentId,
    fields: ["documentId"],
    populate: getNestedProtectedAreaPopulate(collectionType),
    status: "published",
  });

  const relatedProtectedAreas = [
    entry?.protectedArea,
    entry?.parkFeature?.protectedArea,
    entry?.parkArea?.protectedArea,
  ];

  // Return unique non-empty protected area document IDs
  return [
    ...new Set(
      relatedProtectedAreas
        .map((relatedProtectedArea) => relatedProtectedArea?.documentId)
        .filter(Boolean),
    ),
  ];
}

function getNestedProtectedAreaPopulate(collectionType) {
  const populate = {
    protectedArea: {
      fields: ["documentId"],
    },
    parkFeature: {
      populate: { protectedArea: { fields: ["documentId"] } },
    },
  };

  if (collectionType === "api::park-gate.park-gate") {
    populate.parkArea = {
      populate: { protectedArea: { fields: ["documentId"] } },
    };
  }

  return populate;
}
