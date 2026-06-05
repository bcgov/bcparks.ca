"use strict";

/**
 * Migration: Clean up public_advisory_audits data
 */

module.exports = {
  async up(knex) {
    if (!(await knex.schema.hasTable("public_advisory_audits"))) {
      return;
    }

    if (
      !(await knex.schema.hasColumn("public_advisory_audits", "published_date"))
    ) {
      return;
    }

    // Set modified_date to updated_at when it's null
    await knex.raw(`
      UPDATE public_advisory_audits
      SET modified_date = updated_at
      WHERE modified_date IS NULL
    `);

    // Normalize submitted_by_name from IDIR usernames to full names
    const submittedByNameUpdates = [
      ["Robert Fiddler", "Rob Fiddler"],
      ["Michael Olund", "Mike Olund"],
      ["Steven Carpenter", "srcarpen"],
      ["Brett Yerex", "byerex"],
      ["Simon Debisschop", "sdebissc"],
      ["Meghan Driver", "mdriver"],
    ];
    for (const [fullName, idir] of submittedByNameUpdates) {
      await knex.raw(
        `
        UPDATE public_advisory_audits
        SET submitted_by_name = ?
        WHERE submitted_by_name = ?
      `,
        [fullName, idir],
      );
    }

    // Normalize modified_by_name from IDIR/display names to full names
    const modifiedByNameUpdates = [
      ["Robert Fiddler", "Fiddler, Robert ENV:EX"],
      ["Brett Yerex", "Yerex, Brett ENV:EX"],
      ["Steven Carpenter", "Carpenter, Steven R ENV:EX"],
      ["Tammy Liddicoat", "Liddicoat, Tammy C ENV:EX"],
      [null, ""],
    ];
    for (const [fullName, raw] of modifiedByNameUpdates) {
      await knex.raw(
        `
        UPDATE public_advisory_audits
        SET modified_by_name = ?
        WHERE modified_by_name = ?
      `,
        [fullName, raw],
      );
    }

    // Fall back to created_by_name if modified_by_name is still null
    await knex.raw(`
      UPDATE public_advisory_audits
      SET modified_by_name = created_by_name
      WHERE modified_by_name IS NULL
        AND created_by_name IS NOT NULL
        AND created_by_name <> ''
    `);

    // Copy submitted_by_name to modified_by_name for known web team members on revision 1
    await knex.raw(`
      UPDATE public_advisory_audits
      SET modified_by_name = submitted_by_name
      WHERE (modified_by_name IS NULL OR modified_by_name = '')
        AND submitted_by_name IN (
          'Steven Carpenter', 'Robert Fiddler', 'Brett Yerex',
          'Leah Wilcock', 'Sam Terani', 'Brittany Heath',
          'Creole Carmichael', 'Samuel Macklin', 'Tammy Liddicoat',
          'Simon Debisschop', 'Meghan Driver'
        )
        AND revision_number = 1
    `);

    // Default remaining nulls to 'Unknown'
    await knex.raw(`
      UPDATE public_advisory_audits
      SET modified_by_name = 'Unknown'
      WHERE modified_by_name IS NULL OR modified_by_name = ''
    `);

    // Populate published_date and published_by_name for PUB status records
    await knex.raw(`
      UPDATE public_advisory_audits paa
      SET published_date = paa.modified_date,
          published_by_name = paa.modified_by_name
      FROM public_advisory_audits_advisory_status_lnk paaasl
      INNER JOIN advisory_statuses t ON t.id = paaasl.advisory_status_id
      WHERE paa.id = paaasl.public_advisory_audit_id
        AND t.code = 'PUB'
        AND published_date IS NULL
    `);

    // Fill in created_date for revision 1 using the earliest created_at per advisory
    await knex.raw(`
      WITH min_created AS (
        SELECT advisory_number, MIN(created_at) AS created_at
        FROM public_advisory_audits
        GROUP BY advisory_number
      )
      UPDATE public_advisory_audits paa
      SET created_date = mc.created_at
      FROM min_created mc
      WHERE paa.advisory_number = mc.advisory_number
        AND paa.created_date IS NULL
        AND paa.revision_number = 1
    `);

    // Fill in created_by_name for revision 1 from modified_by_name
    await knex.raw(`
      WITH rev1 AS (
        SELECT advisory_number, modified_by_name
        FROM public_advisory_audits
        WHERE revision_number = 1
      )
      UPDATE public_advisory_audits paa
      SET created_by_name = r.modified_by_name
      FROM rev1 r
      WHERE paa.advisory_number = r.advisory_number
        AND paa.created_by_name IS NULL
        AND paa.revision_number = 1
    `);

    // Set modified_by_role to 'contributor' for 'Unknown' entries
    await knex.raw(`
      UPDATE public_advisory_audits
      SET modified_by_role = 'contributor'
      WHERE (modified_by_role IS NULL OR modified_by_role = '')
        AND modified_by_name = 'Unknown'
    `);

    // Set created_by_role to 'contributor' for 'Unknown' entries
    await knex.raw(`
      UPDATE public_advisory_audits
      SET created_by_role = 'contributor'
      WHERE (created_by_role IS NULL OR created_by_role = '')
        AND created_by_name = 'Unknown'
    `);

    // Default remaining created_by_role to 'submitter'
    await knex.raw(`
      UPDATE public_advisory_audits
      SET created_by_role = 'submitter'
      WHERE (created_by_role IS NULL OR created_by_role = '')
        AND created_by_name IS NOT NULL
    `);

    // Default remaining modified_by_role to 'submitter'
    await knex.raw(`
      UPDATE public_advisory_audits
      SET modified_by_role = 'submitter'
      WHERE modified_by_role IS NULL OR modified_by_role = ''
    `);

    // Populate unpublished_date and unpublished_by_name for UNP status records
    await knex.raw(`
      UPDATE public_advisory_audits paa
      SET unpublished_date = paa.modified_date,
          unpublished_by_name = paa.modified_by_name
      FROM public_advisory_audits_advisory_status_lnk paaasl
      INNER JOIN advisory_statuses t ON t.id = paaasl.advisory_status_id
      WHERE paa.id = paaasl.public_advisory_audit_id
        AND t.code = 'UNP'
        AND unpublished_date IS NULL
    `);

    // Mark latest revisions modified by an approver as reviewed
    await knex.raw(`
      UPDATE public_advisory_audits
      SET reviewed_by_name = modified_by_name,
          reviewed_date = modified_date
      WHERE modified_by_role = 'approver' and is_latest_revision = true
    `);

    // Mark latest revisions not modified in the past 90 days as reviewed
    await knex.raw(`
      UPDATE public_advisory_audits
      SET reviewed_by_name = modified_by_name,
          reviewed_date = modified_date
      WHERE modified_date < (CURRENT_DATE - INTERVAL '90 days')  and is_latest_revision = true
    `);

    // Normalize 'system' reviewed_by_name to 'Unknown'
    await knex.raw(`
      UPDATE public_advisory_audits
      SET reviewed_by_name = 'Unknown'
      WHERE reviewed_by_name = 'system'
    `);
  },
};
