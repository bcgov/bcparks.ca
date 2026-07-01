/**
 * Builds a compact Rec Space payload from advisory audit records before
 * queueing `recspace push public-advisory` tasks.
 */

/**
 * Removes common Strapi metadata fields from related entities.
 */
function stripCommonEntityMetadata(entity) {
  if (!entity) {
    return entity;
  }

  const { createdAt, updatedAt, documentId, publishedAt, locale, ...rest } =
    entity;

  return rest;
}

/**
 * Removes unused metadata and coordinates from recreation resource entries.
 */
function stripRecreationResourceFields(resource) {
  if (!resource) {
    return resource;
  }

  const cleanedResource = stripCommonEntityMetadata(resource);
  const { latitude, longitude, ...rest } = cleanedResource;

  return rest;
}

/**
 * Removes BCP-specific or redundant advisory fields that are not required by
 * Rec Space queue consumers.
 */
function stripBcpSpecificAdvisoryFields(publicAdvisoryAudit) {
  if (!publicAdvisoryAudit) {
    return null;
  }

  const {
    links,
    mapZoom,
    latitude,
    longitude,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt,
    documentId,
    publishedAt,
    locale,
    localizations,
    protectedAreas,
    sites,
    naturalResourceDistricts,
    managementAreas,
    regions,
    sections,
    fireZones,
    fireCentres,
    recreationDistricts,
    ...rstFields
  } = publicAdvisoryAudit;

  if (rstFields.urgency) {
    rstFields.urgency = stripCommonEntityMetadata(rstFields.urgency);
  }
  if (rstFields.eventType) {
    rstFields.eventType = stripCommonEntityMetadata(rstFields.eventType);
  }
  if (rstFields.accessStatus) {
    rstFields.accessStatus = stripCommonEntityMetadata(rstFields.accessStatus);
  }
  if (rstFields.advisoryStatus) {
    rstFields.advisoryStatus = stripCommonEntityMetadata(
      rstFields.advisoryStatus,
    );
  }
  if (Array.isArray(rstFields.recreationResources)) {
    rstFields.recreationResources = rstFields.recreationResources.map(
      stripRecreationResourceFields,
    );
  }

  return rstFields;
}

module.exports = {
  stripBcpSpecificAdvisoryFields,
};
