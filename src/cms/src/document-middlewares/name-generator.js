// Middleware to generate names various park-related collection types
const pageActions = ["create", "update"];

// Generic helper function to get type name label for various collections
async function typeNameLabel(data, dbRecord, config) {
  const { typeAttributeName, typeNameField, typeCollectionUid } = config;
  const typeDocumentId = data[typeAttributeName]?.connect?.[0]?.documentId;
  return typeDocumentId
    ? (
        await strapi.documents(typeCollectionUid).findOne({
          documentId: typeDocumentId,
          fields: [typeNameField],
        })
      )?.[typeNameField]
    : (dbRecord?.[typeAttributeName]?.[typeNameField] ?? "");
}

// Specialized helper function to get label for park-contact
async function contactLabel(data, dbRecord, config) {
  // if the po contact is being removed, just return the title
  if (
    data.parkOperatorContact?.connect?.length <
    data.parkOperatorContact?.disconnect?.length
  ) {
    return data.title || dbRecord?.title || "";
  }
  const parkOperatorContactName = await typeNameLabel(data, dbRecord, config);
  return parkOperatorContactName || data.title || dbRecord?.title || "";
}

// each collection is a little bit different, so we use a config array to generalize the logic
const collections = [
  {
    uid: "api::park-facility.park-facility",
    labelFunction: typeNameLabel,
    config: {
      typeCollectionUid: "api::facility-type.facility-type",
      typeAttributeName: "facilityType",
      typeNameField: "facilityName",
    },
  },
  {
    uid: "api::park-activity.park-activity",
    labelFunction: typeNameLabel,
    config: {
      typeCollectionUid: "api::activity-type.activity-type",
      typeAttributeName: "activityType",
      typeNameField: "activityName",
    },
  },
  {
    uid: "api::park-camping-type.park-camping-type",
    labelFunction: typeNameLabel,
    config: {
      typeCollectionUid: "api::camping-type.camping-type",
      typeAttributeName: "campingType",
      typeNameField: "campingTypeName",
    },
  },
  {
    uid: "api::park-guideline.park-guideline",
    labelFunction: typeNameLabel,
    config: {
      typeCollectionUid: "api::guideline-type.guideline-type",
      typeAttributeName: "guidelineType",
      typeNameField: "guidelineName",
    },
  },
  {
    uid: "api::park-contact.park-contact",
    labelFunction: contactLabel,
    config: {
      typeCollectionUid: "api::park-operator-contact.park-operator-contact",
      typeAttributeName: "parkOperatorContact",
      typeNameField: "defaultTitle",
    },
  },
];
const collectionTypes = collections.map((c) => c.uid);

// Function to update the label based on protected area or site, and type name
const updateLabel = async (data, uid) => {
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
  const { labelFunction, config } =
    collections.find((c) => c.uid === uid) || {};

  // get protected area
  const paDocumentId = data.protectedArea?.connect?.[0]?.documentId;
  const protectedArea = paDocumentId
    ? await strapi.documents("api::protected-area.protected-area").findOne({
        documentId: paDocumentId,
        fields: ["orcs"],
      })
    : recordInstance?.protectedArea;

  // get site
  const siteDocumentId = data.site?.connect?.[0]?.documentId;
  const site = siteDocumentId
    ? await strapi.documents("api::site.site").findOne({
        documentId: siteDocumentId,
        fields: ["orcsSiteNumber"],
      })
    : recordInstance?.site;

  // get end of the label
  const nameSuffix = await labelFunction(data, recordInstance, config);

  // generate label
  data.name = "";
  if (protectedArea) {
    data.name = protectedArea.orcs;
  }
  if (site) {
    data.name = site.orcsSiteNumber;
  }
  if (nameSuffix) {
    data.name += `:${nameSuffix}`;
  } else {
    data.name += ":None";
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

    await updateLabel(context.params.data, context.uid);

    return await next(); // Call the next middleware in the stack
  };
};

module.exports = nameGeneratorMiddleware;
