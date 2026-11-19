/**
 * System alert rules. Each rule watches one or more queued-task actions and
 * emails its recipient groups when tasks have been stuck in the queue for
 * longer than the threshold.
 *
 * - key: stable identifier, used in the alert state file
 * - name: what is failing, written as it reads mid-sentence (e.g. "RecSpace
 *   advisory sync"). Used in the subject, heading and resolved email.
 * - systemName: what the recipients are subscribed to, used in the email
 *   footer ("...on the alert list for <systemName>.")
 * - actions: queued-task actions to watch
 * - numericDataLabel: what the queued tasks' numericData holds for these
 *   actions (e.g. advisory numbers or ORCS), shown in the email
 * - thresholdMinutes: how old a task must be before it counts as stuck
 * - recipientVars: env vars holding comma-separated recipient lists
 * - description: plain-language explanation shown in the email (HTML allowed)
 * - headerTitle (optional): text next to the logo in the email header.
 *   Defaults to "Parks and Recreation staff web portal".
 * - reminderHours (optional): hours between reminder emails while the alert
 *   is still active. Defaults to SYSTEM_ALERT_REMINDER_HOURS (6 if unset).
 */
module.exports = [
  {
    key: "recspace-sync",
    // "RecSpace advisory sync is failing" (alert subject and heading)
    // "Still failing: RecSpace advisory sync" (reminder subject)
    // "RecSpace advisory sync is working again" (resolved heading)
    // "Good news: the problem with RecSpace advisory sync has been fixed."
    name: "RecSpace advisory sync",
    // "...you are on the alert list for the advisory sync from ACT to RecSpace."
    systemName: "the advisory sync from ACT to RecSpace",
    actions: ["recspace publish advisory"],
    numericDataLabel: "Advisory numbers",
    thresholdMinutes: 15,
    recipientVars: [
      "ALERT_PARKS_DEV_RECIPIENTS",
      "ALERT_PARKS_WEB_TEAM_RECIPIENTS",
      "ALERT_RST_DEV_RECIPIENTS",
    ],
    description:
      "Public advisory changes are not reaching RecSpace. The scheduler retries every " +
      "minute, but these advisories have been waiting longer than expected. Until this " +
      "is fixed, sitesandtrailsbc.ca may show advisories that are out of date, missing, " +
      "or already expired in ACT.",
  },
  {
    key: "search-index",
    // "Park search indexing is failing" (alert subject and heading)
    // "Still failing: Park search indexing" (reminder subject)
    // "Park search indexing is working again" (resolved heading)
    // "Good news: the problem with park search indexing has been fixed."
    name: "park search indexing",
    // "...you are on the alert list for park search indexing for bcparks.ca."
    systemName: "park search indexing for bcparks.ca",
    headerTitle: "bcparks.ca search indexing",
    actions: [
      "elastic index park",
      "elastic remove park",
      "elastic batch-queue parks",
    ],
    numericDataLabel: "ORCS",
    thresholdMinutes: 60,
    recipientVars: [
      "ALERT_PARKS_DEV_RECIPIENTS",
      "ALERT_PARKS_WEB_TEAM_RECIPIENTS",
    ],
    description:
      "Park changes are not reaching the search index behind the Find a park page " +
      "on bcparks.ca. The scheduler retries every minute, but these parks have been " +
      "waiting longer than expected. Until this is fixed, the Find a park page may " +
      "show out-of-date names, access statuses or advisories, or still show parks " +
      "that were removed. Park pages themselves are not affected.",
  },
  {
    key: "doot-publish",
    // "DOOT publishing is failing" (alert subject and heading)
    // "Still failing: DOOT publishing" (reminder subject)
    // "DOOT publishing is working again" (resolved heading)
    // "Good news: the problem with DOOT publishing has been fixed."
    name: "DOOT publishing",
    // "...you are on the alert list for DOOT publishing to bcparks.ca."
    systemName: "DOOT publishing to bcparks.ca",
    actions: ["doot publish"],
    numericDataLabel: "ORCS",
    thresholdMinutes: 30,
    recipientVars: [
      "ALERT_PARKS_DEV_RECIPIENTS",
      "ALERT_DOOT_ADMIN_RECIPIENTS",
    ],
    description:
      "Changes published in DOOT are not reaching bcparks.ca. The scheduler retries " +
      "every minute, but these changes have been waiting longer than expected. Until " +
      "this is fixed, the public API and park pages may show out-of-date dates of " +
      "operation and gate information.",
  },
  {
    key: "email-advisory",
    // "Advisory email sending is failing" (alert subject and heading)
    // "Still failing: Advisory email sending" (reminder subject)
    // "Advisory email sending is working again" (resolved heading)
    // "Good news: the problem with advisory email sending has been fixed."
    name: "advisory email sending",
    // "...you are on the alert list for advisory workflow emails."
    systemName: "advisory workflow emails",
    actions: ["email advisory"],
    numericDataLabel: "Advisory numbers",
    thresholdMinutes: 30,
    recipientVars: [
      "ALERT_PARKS_DEV_RECIPIENTS",
      "ALERT_PARKS_WEB_TEAM_RECIPIENTS",
    ],
    description:
      "Advisory workflow emails are getting stuck in the queue. The scheduler retries " +
      "every minute, but these emails have been waiting longer than expected. Until " +
      "this is fixed, staff won't get requests to review draft and posted advisories, " +
      "or reminders about advisories that are publishing soon, expiring, or reaching " +
      "their end date.",
  },
  {
    key: "email-doot",
    // "DOOT email sending is failing" (alert subject and heading)
    // "Still failing: DOOT email sending" (reminder subject)
    // "DOOT email sending is working again" (resolved heading)
    // "Good news: the problem with DOOT email sending has been fixed."
    name: "DOOT email sending",
    // "...you are on the alert list for DOOT notification emails."
    systemName: "DOOT notification emails",
    actions: ["email doot"],
    numericDataLabel: "Season IDs",
    thresholdMinutes: 30,
    recipientVars: [
      "ALERT_PARKS_DEV_RECIPIENTS",
      "ALERT_DOOT_ADMIN_RECIPIENTS",
    ],
    description:
      "DOOT notification emails are getting stuck in the queue. The scheduler retries every " +
      "minute, but these emails have been waiting longer than expected. Until this is " +
      "fixed, recipients won't be notified about actions required in DOOT.",
  },
  {
    key: "email-parkname-change",
    // "Park name change email sending is failing" (alert subject and heading)
    // "Still failing: Park name change email sending" (reminder subject)
    // "Park name change email sending is working again" (resolved heading)
    // "Good news: the problem with park name change email sending has been fixed."
    name: "park name change email sending",
    // "...you are on the alert list for park name change emails."
    systemName: "park name change emails",
    actions: ["email parkname change"],
    numericDataLabel: "ORCS",
    thresholdMinutes: 30,
    reminderHours: 24,
    recipientVars: [
      "ALERT_PARKS_DEV_RECIPIENTS",
      "ALERT_PARKS_WEB_TEAM_RECIPIENTS",
    ],
    description:
      "Park name change emails are getting stuck in the queue. The scheduler retries every " +
      "minute, but these emails have been waiting longer than expected. Until this is " +
      "fixed, nobody will be asked to review park content after a park name changes.",
  },
];
