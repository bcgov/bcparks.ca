// Middleware to generate names for park facilities, activities, camping types, and guidelines.

// each collection is a little bit different, so we use a config array to generalize the logic
const config = [
  {
    uid: "api::park-facility.park-facility",
    typeCollectionUid: "api::facility-type.facility-type",
    typeAttributeName: "facilityType",
    typeNameField: "facilityName",
  },
  {
    uid: "api::park-activity.park-activity",
    typeCollectionUid: "api::activity-type.activity-type",
    typeAttributeName: "activityType",
    typeNameField: "activityName",
  },
  {
    uid: "api::park-camping-type.park-camping-type",
    typeCollectionUid: "api::camping-type.camping-type",
    typeAttributeName: "campingType",
    typeNameField: "campingTypeName",
  },
  {
    uid: "api::park-guideline.park-guideline",
    typeCollectionUid: "api::guideline-type.guideline-type",
    typeAttributeName: "guidelineType",
    typeNameField: "guidelineName",
  },
];
const pageActions = ["create", "update"];
const collectionTypes = config.map((c) => c.uid);

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
  const { typeAttributeName, typeNameField, typeCollectionUid } =
    config.find((c) => c.uid === uid) || {};

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

  // get type name
  const typeDocumentId = data[typeAttributeName]?.connect?.[0]?.documentId;
  const typeName = typeDocumentId
    ? (
        await strapi.documents(typeCollectionUid).findOne({
          documentId: typeDocumentId,
          fields: [typeNameField],
        })
      )?.[typeNameField]
    : (recordInstance?.[typeAttributeName]?.[typeNameField] ?? "");

  // generate label
  data.name = "";
  if (protectedArea) {
    data.name = protectedArea.orcs;
  }
  if (site) {
    data.name = site.orcsSiteNumber;
  }
  if (typeName) {
    data.name += `:${typeName}`;
  } else {
    data.name += ":None";
  }

  return data;
};

// The middleware function
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
