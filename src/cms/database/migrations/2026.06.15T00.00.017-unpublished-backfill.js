"use strict";

/*
Backfill audit metadata for unpublished advisories.

For advisories whose latest revision is UNP, copy audit metadata from that latest
UNP revision to the previous revision (revision_number - 1), but only when the
previous revision is PUB.

Source values on the UNP revision:
- published_by_name (fallback: modified_by_name)
- published_date    (fallback: modified_date)

Reason:
Unpublish audit metadata is now stored on the previous published revision, which
is the record that actually transitioned from published to unpublished.
*/

module.exports = {
  async up(knex) {
    // check if the advisories table exists and if it contains an "is_published" column
    if (
      (await knex.schema.hasTable("public_advisory_audits")) &&
      (await knex.schema.hasColumn(
        "public_advisory_audits",
        "unpublished_date",
      ))
    ) {
      await knex.raw(`
WITH latest_unpublished AS (
    SELECT
        paa.advisory_number,
        MAX(paa.revision_number) AS revision_number
    FROM public_advisory_audits paa
    JOIN public_advisory_audits_advisory_status_lnk paaasl
        ON paaasl.public_advisory_audit_id = paa.id
    JOIN advisory_statuses t
        ON t.id = paaasl.advisory_status_id
    WHERE
        paa.is_latest_revision = true
        AND t.code = 'UNP'
    GROUP BY paa.advisory_number
    HAVING MAX(paa.revision_number) > 1
) UPDATE public_advisory_audits prev
SET
    published_by_name = COALESCE(curr.published_by_name, curr.modified_by_name),
    published_date    = COALESCE(curr.published_date, curr.modified_date)
FROM latest_unpublished lu
JOIN public_advisory_audits curr
    ON curr.advisory_number = lu.advisory_number
   AND curr.revision_number = lu.revision_number
WHERE
    prev.advisory_number = lu.advisory_number
    AND prev.revision_number = lu.revision_number - 1
    AND (
        SELECT s.code
        FROM public_advisory_audits_advisory_status_lnk lnk
        JOIN advisory_statuses s
            ON s.id = lnk.advisory_status_id
        WHERE lnk.public_advisory_audit_id = prev.id
        LIMIT 1
    ) = 'PUB';
      `);
    }
  },
};
