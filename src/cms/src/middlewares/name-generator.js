/**
 *  NAME GENERATOR (Document Services Middleware)
 *  Creates display names for park-related collections using ORCS-based
 *  well-known keys (example: "9508:Hiking")
 */

// CONFIGURATION

const pageActions = ["create", "update"];

// Configuration for each collection type that needs auto-generated names
// Each entry specifies:
// - uid: the collection type identifier
// - suffixGenerator: function that generates the suffix part of the name (after the colon)
// - config: configuration for the suffixGenerator
//   - relatedContentType: UID of the related content type to query
//   - relationName: field name of the relation in the current document
//   - labelFieldName: field name in the related document to use as the suffix
const collections = [
  {
    uid: "api::park-facility.park-facility",
    suffixGenerator: standardRelationLabel,
    config: {
      relatedContentType: "api::facility-type.facility-type",
      relationName: "facilityType",
      labelFieldName: "facilityName",
    },
  },
  {
    uid: "api::park-activity.park-activity",
    suffixGenerator: standardRelationLabel,
    config: {
      relatedContentType: "api::activity-type.activity-type",
      relationName: "activityType",
      labelFieldName: "activityName",
    },
  },
  {
    uid: "api::park-camping-type.park-camping-type",
    suffixGenerator: standardRelationLabel,
    config: {
      relatedContentType: "api::camping-type.camping-type",
      relationName: "campingType",
      labelFieldName: "campingTypeName",
    },
  },
  {
    uid: "api::park-guideline.park-guideline",
    suffixGenerator: standardRelationLabel,
    config: {
      relatedContentType: "api::guideline-type.guideline-type",
      relationName: "guidelineType",
      labelFieldName: "guidelineName",
    },
  },
  {
    uid: "api::park-contact.park-contact",
    suffixGenerator: contactLabel,
    config: {
      relatedContentType: "api::park-operator-contact.park-operator-contact",
      relationName: "parkOperatorContact",
      labelFieldName: "defaultTitle",
    },
  },
  {
    uid: "api::park-date.park-date",
    suffixGenerator: parkDateLabel,
    config: {
      relatedContentType: "api::park-date-type.park-date-type",
      relationName: "parkDateType",
      labelFieldName: "dateType",
    },
  },
];
const collectionTypes = collections.map((c) => c.uid);

// MAIN MIDDLEWARE FUNCTION (scaffolding)

module.exports = () => {
  return async (context, next) => {
    if (
      !collectionTypes.includes(context.uid) ||
      !pageActions.includes(context.action)
    ) {
      return await next(); // Call the next middleware in the stack
    }

    strapi.log.info(`nameGeneratorMiddleware ${context.uid}-${context.action}`);

    await updateName(context.params.data, context.uid);

    return await next(); // Call the next middleware in the stack
  };
};

// HELPER FUNCTIONS

// This is the main workhorse function that generates display name by combining a prefix
// (orcs, orcsSiteNumber, PA-orcsAreaNumber, F-orcsFeatureNumber) and a generated suffix.
// Modifies data.name in place with format: {prefix}:{suffix}
async function updateName(data, uid) {
  let recordInstance = {};

  // fetch existing record if documentId is present
  if (data.documentId) {
    recordInstance =
      (await strapi.documents(uid).findOne({
        documentId: data.documentId,
        populate: "*",
        status: data.status,
      })) || {};
  }

  // get config for this uid
  const { suffixGenerator, config } =
    collections.find((c) => c.uid === uid) || {};

  const nameAffectingFields = [
    "protectedArea",
    "site",
    "parkFeature",
    "parkArea",
    config?.relationName,
  ].filter(Boolean);

  const isUpdatingNameFields = nameAffectingFields.some(
    (field) => data[field] !== undefined,
  );

  // If this is an update and none of the name-affecting relations are changing,
  // preserve the existing name
  if (recordInstance.documentId && !isUpdatingNameFields) {
    if (recordInstance.name && !data.name) {
      data.name = recordInstance.name;
      return data;
    }
  }

  // get protected area
  const protectedArea = await fetchRelation(
    "api::protected-area.protected-area",
    getDocumentId(data.protectedArea),
    recordInstance?.protectedArea,
    ["orcs"],
  );

  // get site (if applicable)
  const site = await fetchRelation(
    "api::site.site",
    getDocumentId(data.site),
    recordInstance?.site,
    ["orcsSiteNumber"],
  );

  // get park feature (if applicable)
  const parkFeature = await fetchRelation(
    "api::park-feature.park-feature",
    getDocumentId(data.parkFeature),
    recordInstance?.parkFeature,
    ["orcsFeatureNumber"],
  );

  // get park area (if applicable)
  const parkArea = await fetchRelation(
    "api::park-area.park-area",
    getDocumentId(data.parkArea),
    recordInstance?.parkArea,
    ["orcsAreaNumber"],
  );

  // get suffix of the label
  const nameSuffix = await suffixGenerator(data, recordInstance, config);

  // generate label and assign to data.name
  data.name = "";
  if (protectedArea) {
    data.name = String(protectedArea.orcs);
  }
  if (site) {
    data.name = site.orcsSiteNumber;
  }
  if (parkArea) {
    data.name = `PA-${parkArea.orcsAreaNumber}`;
  }
  if (parkFeature) {
    data.name = `F-${parkFeature.orcsFeatureNumber}`;
  }
  if (nameSuffix) {
    data.name += `:${nameSuffix}`;
  }

  return data;
}

// Extracts documentId from either plain string or connect/disconnect format
function getDocumentId(relationData) {
  if (typeof relationData === "string") return relationData;
  if (relationData?.connect?.[0]?.documentId)
    return relationData.connect[0].documentId;
  return null;
}

// Fetches a related document by documentId or use existing record
async function fetchRelation(uid, documentId, fallback, fields) {
  if (documentId) {
    return await strapi.documents(uid).findOne({ documentId, fields });
  }
  return fallback;
}

// SUFFIX GENERATOR FUNCTIONS

// Standard suffix generator that retrieves the name from a related content type
// Uses the config to specify which relation to follow and which field to use as the suffix
async function standardRelationLabel(data, dbRecord, config) {
  const { relationName, labelFieldName, relatedContentType } = config;
  const typeDocumentId = getDocumentId(data[relationName]);
  return typeDocumentId
    ? (
        await strapi.documents(relatedContentType).findOne({
          documentId: typeDocumentId,
          fields: [labelFieldName],
        })
      )?.[labelFieldName]
    : (dbRecord?.[relationName]?.[labelFieldName] ?? "");
}

// Custom suffix generator for park-contact - example of extending standardRelationLabel
// Falls back to the contact's title field.
async function contactLabel(data, dbRecord, config) {
  const isRemovingParkOperatorContact =
    data.parkOperatorContact?.connect?.length <
    data.parkOperatorContact?.disconnect?.length;

  const titleFallback = data.title || dbRecord?.title || "";

  if (isRemovingParkOperatorContact) {
    return titleFallback;
  }

  const poContactName = await standardRelationLabel(data, dbRecord, config);
  return poContactName || titleFallback;
}

// Custom suffix generator for park-date - combines operating year and date type
// e.g.: "F-104-2: 2022 - Backcountry registration"
async function parkDateLabel(data, dbRecord, config) {
  const year = data.operatingYear || dbRecord?.operatingYear || "";
  const dateType = await standardRelationLabel(data, dbRecord, config);
  return ` ${year} - ${dateType}`;
}
