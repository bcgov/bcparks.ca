/**
 * Builds a flat Rec Space payload from advisory audit records before
 * queueing `recspace publish advisory` tasks.
 */

/**
 * Maps a public advisory audit record to the flattened payload expected by
 * the RecSpace API.
 */
function buildPayload(paAudit) {
  if (!paAudit) {
    return null;
  }

  return {
    rec_resource_ids: (paAudit.recreationResources ?? []).flatMap((resource) =>
      resource?.recResourceId ? [resource.recResourceId] : [],
    ),
    advisory_number: paAudit.advisoryNumber ?? null,
    revision_number: paAudit.revisionNumber ?? null,
    title: paAudit.title ?? null,
    description: paAudit.description ?? null,
    submitted_by: paAudit.submittedByName ?? paAudit.createdByName ?? null,
    access_status_name: paAudit.accessStatus?.accessStatus ?? null,
    access_status_grouplabel: paAudit.accessStatus?.groupLabel ?? null,
    access_status_description: paAudit.accessStatus?.description ?? null,
    event_type: paAudit.eventType?.eventType ?? null,
    urgency: paAudit.urgency?.urgency ?? null,
    advisory_status: paAudit.advisoryStatus?.advisoryStatus ?? null,
    is_reservations_affected: paAudit.isReservationsAffected ?? null,
    is_advisory_date_displayed: paAudit.isAdvisoryDateDisplayed ?? null,
    is_effective_date_displayed: paAudit.isEffectiveDateDisplayed ?? null,
    is_end_date_displayed: paAudit.isEndDateDisplayed ?? null,
    is_updated_date_displayed: paAudit.isUpdatedDateDisplayed ?? null,
    advisory_date: paAudit.advisoryDate ?? null,
    effective_date: paAudit.effectiveDate ?? null,
    end_date: paAudit.endDate ?? null,
    expiry_date: paAudit.expiryDate ?? null,
    removal_date: paAudit.unpublishedDate ?? null,
    // TODO: this should be nullable in the API, but the RecSpace API still expects a date
    updated_date: paAudit.updatedDate ?? new Date(0).toISOString(),
    // updated_date: paAudit.updatedDate ?? null,
    modified_date: paAudit.modifiedDate ?? null,
    // TODO: this will be renamed to published_date soon, but the RecSpace API still expects published_at for now
    published_at: paAudit.publishedDate ?? null,
    // published_date: paAudit.publishedDate ?? null,
    listing_rank: paAudit.listingRank ?? 0,
    urgency_sequence: paAudit.urgency?.sequence ?? 0,
    access_status_precedence: paAudit.accessStatus?.precedence ?? 0,
    event_type_precedence: paAudit.eventType?.precedence ?? 0,
  };
}

/**
 * Keeps only the "before" fields needed to determine which CRUD endpoint
 * should be called.
 */
function buildComparisonPayload(payload) {
  if (!payload) {
    return null;
  }

  return {
    rec_resource_ids: payload.rec_resource_ids ?? [],
    revision_number: payload.revision_number ?? null,
    advisory_status: payload.advisory_status ?? null,
  };
}

module.exports = {
  buildPayload,
  buildComparisonPayload,
};
