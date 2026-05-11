/**
 * Resolves publish intent into the advisoryStatus payload value to save in the DB.
 * Returns null when no status rewrite is needed.
 */
async function resolvePublishIntentStatus(data) {
  // Only resolve statuses when the request is trying to publish.
  const requestedStatusCode = await getAdvisoryStatusCode(data?.advisoryStatus);
  if (requestedStatusCode !== "PUB") {
    return null;
  }

  // Apply date-based publishing rules: UNP (expired) > SCH (future) > PUB (active now).
  const resolvedCode = resolvePublishStatusCode(data);
  if (resolvedCode === requestedStatusCode) {
    return null;
  }

  const resolvedStatus = await getAdvisoryStatusByCode(resolvedCode);
  if (!resolvedStatus) {
    return null;
  }

  return typeof data.advisoryStatus === "object" && data.advisoryStatus !== null
    ? { id: resolvedStatus.id }
    : resolvedStatus.documentId;
}

/**
 * Resolves publish target code based on expiry and posting dates.
 */
function resolvePublishStatusCode(data) {
  const now = new Date();
  const expiryDate = data?.expiryDate ? new Date(data.expiryDate) : null;
  const advisoryDate = data?.advisoryDate ? new Date(data.advisoryDate) : null;

  // If the expiry date is now or in the past, use "Unpublished" status
  if (expiryDate && !Number.isNaN(expiryDate.getTime()) && expiryDate <= now) {
    return "UNP";
  }

  // If the posting date is in the future, use "Scheduled" status
  if (
    advisoryDate &&
    !Number.isNaN(advisoryDate.getTime()) &&
    advisoryDate > now
  ) {
    return "SCH";
  }

  // Default: advisory is active now, so use "Published" status
  return "PUB";
}

/**
 * Reads advisory status code from supported relation payload shapes.
 */
async function getAdvisoryStatusCode(statusValue) {
  // Accept relation values in different shapes (object with code/id/documentId, or documentId string).
  if (!statusValue) return null;

  if (typeof statusValue === "object" && statusValue !== null) {
    // If statusValue already has the code, return it directly
    if (statusValue.code) {
      return statusValue.code;
    }

    // Look up the code based on the provided id or documentId
    if (statusValue.documentId) {
      const status = await strapi
        .documents("api::advisory-status.advisory-status")
        .findOne({
          documentId: statusValue.documentId,
          fields: ["code"],
        });
      return status?.code ?? null;
    }

    if (statusValue.id) {
      const status = await strapi
        .documents("api::advisory-status.advisory-status")
        .findFirst({
          filters: { id: statusValue.id },
          fields: ["code"],
        });
      return status?.code ?? null;
    }
  }

  // If it's a string, treat it as a documentId and look up the code
  if (typeof statusValue === "string") {
    const status = await strapi
      .documents("api::advisory-status.advisory-status")
      .findOne({
        documentId: statusValue,
        fields: ["code"],
      });
    return status?.code ?? null;
  }

  return null;
}

/**
 * Looks up advisory-status metadata by code.
 */
async function getAdvisoryStatusByCode(code) {
  // Resolve status metadata once we know the target code.
  return await strapi
    .documents("api::advisory-status.advisory-status")
    .findFirst({
      filters: { code },
      fields: ["id", "documentId", "code"],
    });
}

module.exports = {
  resolvePublishIntentStatus,
  resolvePublishStatusCode,
  getAdvisoryStatusCode,
  getAdvisoryStatusByCode,
};
