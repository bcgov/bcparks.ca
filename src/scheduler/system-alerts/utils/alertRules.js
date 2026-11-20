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
];
