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
  {
    uid: "api::park-gate.park-gate",
    suffixGenerator: relationNameLabel,
  },
];
const collectionTypes = collections.map((c) => c.uid);

// special return value from suffixGenerator to relation name as suffix
const USE_RELATION_NAME = "use-relation-name";

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

    await updateName(context.params.data || result, context.uid);

    return await next(); // Call the next middleware in the stack again to save changes
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
    (field) => data[field] !== undefined
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
    ["orcs", "protectedAreaName"]
  );

  // get site (if applicable)
  const site = await fetchRelation(
    "api::site.site",
    getDocumentId(data.site),
    recordInstance?.site,
    ["orcsSiteNumber", "siteName"]
  );

  // get park feature (if applicable)
  const parkFeature = await fetchRelation(
    "api::park-feature.park-feature",
    getDocumentId(data.parkFeature),
    recordInstance?.parkFeature,
    ["orcsFeatureNumber", "parkFeatureName"]
  );

  // get park area (if applicable)
  const parkArea = await fetchRelation(
    "api::park-area.park-area",
    getDocumentId(data.parkArea),
    recordInstance?.parkArea,
    ["orcsAreaNumber", "parkAreaName"]
  );

  // get initial suffix of the label
  let suffix = await suffixGenerator(data, recordInstance, config);

  // generate full label
  data.name = combineName(suffix, protectedArea, site, parkArea, parkFeature);

  return data;
}

// Priority for prefix: protected area > site > park area > park feature
// Fallbacks get lower priority because they are based on pre-updated data
function combineName(suffix, protectedArea, site, parkArea, parkFeature) {
  let prefix = "";
  suffix = suffix || "";

  if (protectedArea && !protectedArea.isFallback) {
    prefix = String(protectedArea.orcs);
    suffix = tryGetRelationSuffix(suffix, protectedArea, "protectedAreaName");
  } else if (site && !site.isFallback) {
    prefix = site.orcsSiteNumber;
    suffix = tryGetRelationSuffix(suffix, site, "siteName");
  } else if (parkArea && !parkArea.isFallback) {
    prefix = `PA-${parkArea.orcsAreaNumber}`;
    suffix = tryGetRelationSuffix(suffix, parkArea, "parkAreaName");
  } else if (parkFeature && !parkFeature.isFallback) {
    prefix = `F-${parkFeature.orcsFeatureNumber}`;
    suffix = tryGetRelationSuffix(suffix, parkFeature, "parkFeatureName");
  } else if (protectedArea) {
    prefix = String(protectedArea.orcs);
    suffix = tryGetRelationSuffix(suffix, protectedArea, "protectedAreaName");
  } else if (site) {
    prefix = site.orcsSiteNumber;
    suffix = tryGetRelationSuffix(suffix, site, "siteName");
  } else if (parkArea) {
    prefix = `PA-${parkArea.orcsAreaNumber}`;
    suffix = tryGetRelationSuffix(suffix, parkArea, "parkAreaName");
  } else if (parkFeature) {
    prefix = `F-${parkFeature.orcsFeatureNumber}`;
    suffix = tryGetRelationSuffix(suffix, parkFeature, "parkFeatureName");
  }

  if (prefix && suffix && suffix !== USE_RELATION_NAME) {
    return `${prefix}:${suffix}`;
  } else {
    return prefix || "";
  }
}

// Extracts documentId from plain string, object format or connect/set format
function getDocumentId(relationData) {
  if (typeof relationData === "string") {
    return relationData;
  }
  if (relationData && typeof relationData === "object") {
    if (relationData.documentId) {
      return relationData.documentId;
    }
    if (relationData?.connect?.[0]?.documentId) {
      return relationData.connect[0].documentId;
    }
    if (typeof relationData?.connect === "string") {
      return relationData.connect;
    }
    if (relationData?.set?.[0]?.documentId) {
      return relationData.set[0].documentId;
    }
    if (typeof relationData?.set === "string") {
      return relationData.set;
    }
  }
  return null;
}

// Fetches a related document by documentId or use existing record
async function fetchRelation(uid, documentId, fallback, fields) {
  if (documentId) {
    return await strapi.documents(uid).findOne({ documentId, fields });
  }
  if (fallback) {
    return { isFallback: true, ...fallback };
  }
  return null;
}

// Returns a suffix for the entityNameLabel() generator. The
// The USE_RELATION_NAME constant is a special signal to the main function to
// use the related entity's name field as the suffix.
function tryGetRelationSuffix(currentSuffix, entity, fieldName) {
  if (currentSuffix !== USE_RELATION_NAME) {
    return currentSuffix;
  }
  const relationName = entity?.[fieldName] ?? "";
  return relationName ? ` ${relationName}` : "";
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
    : dbRecord?.[relationName]?.[labelFieldName] ?? "";
}

// Suffix generator that signals to use the related entity's name as suffix.
async function relationNameLabel() {
  return USE_RELATION_NAME;
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
