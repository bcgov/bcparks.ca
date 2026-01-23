// Middleware to auto-generate human-readable display names for park-related collection types
// These names appear as the display representation in Strapi's admin UI when viewing relations
// Format: {orcs|orcsSiteNumber}:{typeName}
// Example: "9508:Hiking" displays instead of just the database ID

const pageActions = ["create", "update"];

// Standard suffix generator that retrieves the name from a related content type
// Uses the config to specify which relation to follow and which field to use as the suffix
async function standardRelationLabel(data, dbRecord, config) {
  const { relationName, labelFieldName, relatedContentType } = config;
  const typeDocumentId = data[relationName]?.connect?.[0]?.documentId;
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
// Falls back to the contact's title field. Injected via suffixGenerator in the config.
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
];
const collectionTypes = collections.map((c) => c.uid);

// Generates display name by combining prefix (ORCS/site number) and generated suffix
// Modifies data.name in place with format: {orcs|orcsSiteNumber}:{suffix}
const updateName = async (data, uid) => {
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

  // get protected area
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
  if (nameSuffix) {
    data.name += `:${nameSuffix}`;
  }

  return data;
};

// The main middleware function
const nameGeneratorMiddleware = (strapi) => {
  return async (context, next) => {
    if (
      !collectionTypes.includes(context.uid) ||
      !pageActions.includes(context.action)
    ) {
      return await next(); // Call the next middleware in the stack
    }

    await updateName(context.params.data, context.uid);

    return await next(); // Call the next middleware in the stack
  };
};

module.exports = nameGeneratorMiddleware;
