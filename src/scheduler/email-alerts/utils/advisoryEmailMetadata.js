const { parseJSON } = require("date-fns");
const { formatInTimeZone } = require("date-fns-tz");
const { getLogger } = require("../../shared/logging");

const METADATA_FIELDS = {
  POSTING_DATE: "POSTING_DATE",
  UPDATED_DATE: "UPDATED_DATE",
  EXPIRY_DATE: "EXPIRY_DATE",
  END_DATE: "END_DATE",
  SUBMITTER: "SUBMITTER",
};

const METADATA_LABELS = {
  [METADATA_FIELDS.POSTING_DATE]: "Posting date",
  [METADATA_FIELDS.UPDATED_DATE]: "Updated date",
  [METADATA_FIELDS.EXPIRY_DATE]: "Expiry date",
  [METADATA_FIELDS.END_DATE]: "End date",
  [METADATA_FIELDS.SUBMITTER]: "Submitter",
};

const METADATA_TIMEZONE = "America/Vancouver";
const METADATA_DATE_FORMAT = "MMMM dd, yyyy hh:mm a";

/**
 * Formats a date string into the advisory email standard timezone/date format.
 * Returns null when the input date is not available.
 */
function formatMetadataDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  return formatInTimeZone(
    parseJSON(dateValue),
    METADATA_TIMEZONE,
    METADATA_DATE_FORMAT,
  );
}

/**
 * Resolves a metadata field ID into a display object with label and value.
 * Returns null when the field is unknown or has no value on the advisory.
 */
function resolveMetadataItem(advisory, fieldId) {
  switch (fieldId) {
    case METADATA_FIELDS.POSTING_DATE:
      return advisory.advisoryDate
        ? {
            label: METADATA_LABELS[fieldId],
            value: formatMetadataDate(advisory.advisoryDate),
          }
        : null;
    case METADATA_FIELDS.UPDATED_DATE:
      return advisory.updatedDate
        ? {
            label: METADATA_LABELS[fieldId],
            value: formatMetadataDate(advisory.updatedDate),
          }
        : null;
    case METADATA_FIELDS.EXPIRY_DATE:
      return advisory.expiryDate
        ? {
            label: METADATA_LABELS[fieldId],
            value: formatMetadataDate(advisory.expiryDate),
          }
        : null;
    case METADATA_FIELDS.END_DATE:
      return advisory.endDate
        ? {
            label: METADATA_LABELS[fieldId],
            value: formatMetadataDate(advisory.endDate),
          }
        : null;
    case METADATA_FIELDS.SUBMITTER:
      return advisory.submittedByName
        ? {
            label: METADATA_LABELS[fieldId],
            value: advisory.submittedByName,
          }
        : null;
    default:
      getLogger().warn(
        `Unknown advisory email metadata field skipped: ${fieldId}`,
      );
      return null;
  }
}

/**
 * Builds ordered email metadata from metadata field IDs supplied in queue jsonData.
 * Missing or unknown fields are skipped while preserving the configured order.
 */
function buildEmailMetadata(advisory, metadataFields = []) {
  if (!advisory || !Array.isArray(metadataFields)) {
    return [];
  }

  return metadataFields
    .map((fieldId) => resolveMetadataItem(advisory, fieldId))
    .filter(Boolean);
}

module.exports = {
  METADATA_FIELDS,
  buildEmailMetadata,
};
