"use strict";

/*
Clean up created_by_name and submitted_by_name on public_advisory_audits.

Step 1: Make created_by_name the same on every revision of an advisory.
The value comes from revision 1, or from the lowest revision with a name if
revision 1 has none, and is copied to all revisions of that advisory_number.
Null, blank, and "Unknown" don't count as names. Advisories with no known
creator on any revision are set to "Unknown" on all revisions.

Step 2: Clear submitted_by_name wherever it doesn't add information.
Rules (applied per advisory_number, ordered by revision_number):
1. On revision 1, clear submitted_by_name if it is the same person as
   created_by_name. Skip this rule when created_by_name is null, blank, or
   "Unknown".
2. Clear submitted_by_name if it is the same person as the most recent
   non-blank submitted_by_name on an earlier revision. Comparisons use the
   original values, not values cleared by this migration.

Names are compared case-insensitively with surrounding whitespace ignored.
Updates are done with knex so Strapi document service middleware isn't triggered.
*/

/**
 * Normalizes a name for comparison.
 *
 * @param {string|null|undefined} name - The name to normalize.
 * @returns {string|null} The trimmed, lowercased name, or null if blank.
 */
function normalizeName(name) {
  const normalized = (name || "").trim().toLowerCase();
  return normalized || null;
}

/**
 * Checks whether a name identifies a real person.
 *
 * @param {string|null|undefined} name - The name to check.
 * @returns {boolean} False if the name is null, blank, or "Unknown".
 */
function isKnownName(name) {
  const normalized = normalizeName(name);
  return normalized !== null && normalized !== "unknown";
}

module.exports = {
  async up(knex) {
    if (!(await knex.schema.hasTable("public_advisory_audits"))) {
      return;
    }

    if (
      !(await knex.schema.hasColumn(
        "public_advisory_audits",
        "submitted_by_name",
      ))
    ) {
      return;
    }

    const rows = await knex("public_advisory_audits")
      .select(
        "id",
        "advisory_number",
        "revision_number",
        "created_by_name",
        "submitted_by_name",
      )
      .orderBy([
        { column: "advisory_number" },
        { column: "revision_number" },
        { column: "id" },
      ]);

    // Step 1: copy the first known created_by_name (or "Unknown") to every
    // revision

    const creatorByAdvisory = new Map();

    for (const row of rows) {
      if (
        !creatorByAdvisory.has(row.advisory_number) &&
        isKnownName(row.created_by_name)
      ) {
        creatorByAdvisory.set(row.advisory_number, row.created_by_name);
      }
    }

    let creatorsUpdated = 0;

    for (const row of rows) {
      // advisories with no known creator on any revision get "Unknown"
      const creator = creatorByAdvisory.get(row.advisory_number) ?? "Unknown";
      if (row.created_by_name === creator) {
        continue;
      }

      await knex("public_advisory_audits")
        .where({ id: row.id })
        .update({ created_by_name: creator });

      // keep the in-memory row in sync so step 2 sees the new value
      row.created_by_name = creator;
      creatorsUpdated++;
    }

    // Step 2: clear submitted_by_name where it repeats the creator or the
    // previous submitter

    let currentAdvisory = null;
    let lastSubmitter = null; // last non-blank original submitter for this advisory
    const idsToClear = [];

    for (const row of rows) {
      if (row.advisory_number !== currentAdvisory) {
        currentAdvisory = row.advisory_number;
        lastSubmitter = null;
      }

      const submitter = normalizeName(row.submitted_by_name);
      if (!submitter) {
        // blank: nothing to clear, and it doesn't reset lastSubmitter
        continue;
      }

      const sameAsCreator =
        row.revision_number === 1 &&
        isKnownName(row.created_by_name) &&
        submitter === normalizeName(row.created_by_name);
      const sameAsPrevious = submitter === lastSubmitter;

      if (sameAsCreator || sameAsPrevious) {
        idsToClear.push(row.id);
      }

      // track the original value, even if it is being cleared
      lastSubmitter = submitter;
    }

    const BATCH_SIZE = 1000;

    for (let i = 0; i < idsToClear.length; i += BATCH_SIZE) {
      await knex("public_advisory_audits")
        .whereIn("id", idsToClear.slice(i, i + BATCH_SIZE))
        .update({ submitted_by_name: null });
    }

    strapi.log.info(
      `submitted-by-cleanup: updated created_by_name on ${creatorsUpdated} of ${rows.length} audit rows`,
    );
    strapi.log.info(
      `submitted-by-cleanup: cleared submitted_by_name on ${idsToClear.length} of ${rows.length} audit rows`,
    );
  },
};
