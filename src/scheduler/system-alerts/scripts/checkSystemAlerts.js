const _ = require("lodash");
const ejs = require("ejs");
const { writeFile } = require("node:fs").promises;
const { differenceInMinutes, parseJSON } = require("date-fns");
const { formatInTimeZone } = require("date-fns-tz");
const { getLogger } = require("../../shared/logging");
const { getStuckTasks } = require("../../shared/taskQueue");
const { readTaskError } = require("../../shared/taskErrors");
const {
  scriptKeySpecified,
  noCommandLineArgs,
} = require("../../shared/commandLine");
const { send } = require("../../shared/email/mailer");
const {
  csvToArray,
  filterRecipientsByEnvironment,
  getLogoAttachment,
  getPreviewHtml,
  getSenderName,
} = require("../../shared/email/emailHelper");
const alertRules = require("../utils/alertRules");
const { readAlertState, writeAlertState } = require("../utils/alertState");

const ALERT_TEMPLATE_PATH = "./system-alerts/templates/system-alert.ejs";
const TIMEZONE = "America/Dawson_Creek";
const DATE_FORMAT = "MMMM dd, yyyy hh:mm a";
// used when SYSTEM_ALERT_REMINDER_HOURS is not set
const DEFAULT_REMINDER_HOURS = 6;

/**
 * Returns the rule's label, e.g. "RecSpace advisory sync is failing".
 *
 * @param {Object} rule Alert rule from alertRules.js.
 * @returns {string} Label used in the subject and heading.
 */
const getRuleLabel = function (rule) {
  return _.upperFirst(`${rule.name} is failing`);
};

/**
 * Returns how many hours to wait between reminder emails for a rule. Uses the
 * rule's own reminderHours if set, otherwise SYSTEM_ALERT_REMINDER_HOURS, or
 * 6 if that isn't a positive number.
 *
 * @param {Object} rule Alert rule from alertRules.js.
 * @returns {number} Hours between reminders.
 */
const getReminderHours = function (rule) {
  const envHours = Number(process.env.SYSTEM_ALERT_REMINDER_HOURS);
  const defaultHours = envHours > 0 ? envHours : DEFAULT_REMINDER_HOURS;
  return rule.reminderHours ?? defaultHours;
};

/**
 * Returns the environment name and the subject prefix for it ("[TEST] ",
 * or nothing in prod).
 *
 * @returns {{environment: string, subjectPrefix: string}} Environment info.
 */
const getEnvironment = function () {
  const environment = (
    process.env.BCPARKS_ENVIRONMENT || "local"
  ).toUpperCase();
  const subjectPrefix = environment === "PROD" ? "" : `[${environment}] `;
  return { environment, subjectPrefix };
};

/**
 * Formats a date for the emails, in BC time.
 *
 * @param {Date|string} date Date or ISO string.
 * @returns {string} Formatted date, e.g. "November 19, 2026 12:20 PM".
 */
const formatDate = function (date) {
  return formatInTimeZone(new Date(date), TIMEZONE, DATE_FORMAT);
};

/**
 * Collects the recipients for a rule from its recipient group env vars.
 *
 * @param {Object} rule Alert rule from alertRules.js.
 * @returns {string[]} Unique recipients (case-insensitive).
 */
const getRuleRecipients = function (rule) {
  const recipients = _.flatMap(rule.recipientVars, (envVar) =>
    csvToArray(process.env[envVar]),
  );
  return _.uniqBy(recipients, _.toLower);
};

/**
 * Returns the scheduler pod name pattern (e.g. "main-scheduler-*") from the
 * pod's hostname, which OpenShift sets to "<deployment>-<replicaset>-<pod>".
 *
 * @returns {string} Pod name pattern, or a generic one when running locally.
 */
const getPodPattern = function () {
  const parts = _.split(process.env.HOSTNAME || "", "-");
  return parts.length > 2 && _.includes(parts, "scheduler")
    ? `${_.dropRight(parts, 2).join("-")}-*`
    : "main-scheduler-* or alpha-scheduler-*";
};

/**
 * Reads the saved errors for the stuck tasks. Identical errors are only
 * included once, so a widespread failure isn't repeated for every task.
 *
 * @param {Object[]} tasks Stuck tasks (with documentId).
 * @returns {Promise<string[]>} Distinct saved errors.
 */
const getStuckTaskErrors = async function (tasks) {
  const errors = await Promise.all(
    _.map(tasks, (task) => readTaskError(task.documentId)),
  );
  return _.uniq(_.compact(errors));
};

/**
 * Builds the data for the system alert email template.
 *
 * @param {Object} rule Alert rule from alertRules.js.
 * @param {Object[]} tasks Oldest stuck tasks (with action, numericData and
 *   createdAt).
 * @param {number} total Total number of stuck tasks.
 * @param {string[]} errors Distinct saved errors for the stuck tasks, from
 *   getStuckTaskErrors().
 * @param {Object} [alertState] The rule's entry in the alert state file. When
 *   set, the email is a reminder for an alert that was already sent.
 * @returns {Object} Template data, including the subject.
 */
const buildEmailData = function (rule, tasks, total, errors, alertState) {
  const { environment, subjectPrefix } = getEnvironment();
  const oldestCreatedAt = parseJSON(tasks[0].createdAt);
  const isReminder = Boolean(alertState);

  return {
    ...rule,
    label: getRuleLabel(rule),
    subject: isReminder
      ? `${subjectPrefix}Still failing: ${_.upperFirst(rule.name)}`
      : `${subjectPrefix}Scheduler alert: ${getRuleLabel(rule)}`,
    isReminder,
    firstAlertedDate: isReminder
      ? formatDate(alertState.firstSentAt ?? alertState.since)
      : null,
    environment,
    total,
    stuckActions: _.uniq(_.map(tasks, "action")),
    oldestDate: formatDate(oldestCreatedAt),
    oldestAgeMinutes: differenceInMinutes(new Date(), oldestCreatedAt),
    ids: _.compact(_.map(tasks, "numericData")),
    errors,
    reminderHours: getReminderHours(rule),
    queuedTasksUrl: `${process.env.STRAPI_BASE_URL}/admin/content-manager/collection-types/api::queued-task.queued-task`,
    podPattern: getPodPattern(),
  };
};

/**
 * Renders a system alert email and sends it to the rule's recipients, or
 * writes it to a preview file when running emailtest.
 *
 * @param {Object} rule Alert rule from alertRules.js.
 * @param {string} templatePath EJS template to render.
 * @param {Object} emailData Template data, including the subject.
 * @param {string} summaryText Plain-text summary for the email.
 * @param {string} testFileName Preview file to write when running emailtest.
 * @returns {Promise<boolean>} True when the email was sent.
 */
const sendRuleEmail = async function (
  rule,
  templatePath,
  emailData,
  summaryText,
  testFileName,
) {
  const logger = getLogger();
  const recipients = getRuleRecipients(rule);

  if (scriptKeySpecified("emailtest")) {
    try {
      const html = await ejs.renderFile(templatePath, {
        ...emailData,
        debugToRecipients: recipients,
      });
      await writeFile(testFileName, getPreviewHtml(html));
    } catch (error) {
      logger.error(
        `sendRuleEmail() failed while writing ${testFileName}: ${error}`,
      );
    }
    return false;
  }

  if (process.env.EMAIL_ENABLED?.toLowerCase() !== "true") {
    logger.warn(
      `"${emailData.subject}" not sent because EMAIL_ENABLED is not true.`,
    );
    return false;
  }

  // prevent emailing anyone outside EMAIL_RECIPIENT_WHITELIST in non-prod
  const recipientsToSend = filterRecipientsByEnvironment(
    recipients,
    logger,
    `system alert ${rule.key}`,
  );

  if (!recipientsToSend.length) {
    logger.error(
      `"${emailData.subject}" not sent because it has no recipients. ` +
        `Check ${rule.recipientVars.join(", ")}.`,
    );
    return false;
  }

  try {
    const html = await ejs.renderFile(templatePath, emailData);
    await send(
      emailData.subject,
      html,
      summaryText,
      getSenderName(),
      recipientsToSend,
      [],
      getLogoAttachment(),
    );
  } catch (error) {
    // the state file isn't updated, so it's retried on the next run
    logger.error(
      `sendRuleEmail() failed while sending "${emailData.subject}": ${error}`,
    );
    return false;
  }
  logger.info(
    `Sent "${emailData.subject}" to ${recipientsToSend.length} recipient(s)`,
  );
  return true;
};

/**
 * Sends the alert email for one rule, or a reminder when the alert is already
 * active.
 *
 * @param {Object} rule Alert rule from alertRules.js.
 * @param {Object[]} tasks Oldest stuck tasks.
 * @param {number} total Total number of stuck tasks.
 * @param {Object} [alertState] The rule's entry in the alert state file, for
 *   a reminder.
 * @returns {Promise<boolean>} True when the email was sent.
 */
const sendAlert = async function (rule, tasks, total, alertState) {
  const errors = await getStuckTaskErrors(tasks);
  const emailData = buildEmailData(rule, tasks, total, errors, alertState);
  const suffix = alertState ? "-reminder" : "";
  return sendRuleEmail(
    rule,
    ALERT_TEMPLATE_PATH,
    emailData,
    `${emailData.label}: ${total} queued tasks waiting`,
    `./mail-test-alert-${rule.key}${suffix}.html`,
  );
};

/**
 * Checks every alert rule for queued tasks that have been waiting longer than
 * the rule's threshold. Emails the rule's recipients when an alert starts and
 * every few hours while it continues (reminderHours).
 * Active alerts are kept in a state file so restarts don't cause repeat
 * emails.
 *
 * @returns {Promise<void>} Resolves when all rules have been checked.
 */
const checkSystemAlerts = async function () {
  const logger = getLogger();
  const shouldSend =
    scriptKeySpecified("systemalerts") ||
    scriptKeySpecified("emailtest") ||
    noCommandLineArgs();

  if (!shouldSend) {
    return;
  }

  const state = await readAlertState();
  let stateChanged = false;

  for (const rule of alertRules) {
    let stuck;
    try {
      const cutoff = new Date(Date.now() - rule.thresholdMinutes * 60 * 1000);
      stuck = await getStuckTasks(rule.actions, cutoff);
    } catch (error) {
      logger.error(
        `checkSystemAlerts() failed while checking "${rule.key}": ${error}`,
      );
      continue;
    }

    const isStuck = stuck.total > 0;
    const isActive = Boolean(state[rule.key]);

    // emailtest renders the alert email for the rule's current state to a
    // file (a reminder for an active alert, even if one isn't due yet) and
    // leaves the state alone
    if (scriptKeySpecified("emailtest")) {
      if (isStuck) {
        await sendAlert(rule, stuck.tasks, stuck.total, state[rule.key]);
      }
      continue;
    }

    const now = new Date().toISOString();

    if (isStuck && !isActive) {
      // send first, then record it, so a crash causes a duplicate email
      // rather than a missed one
      const sent = await sendAlert(rule, stuck.tasks, stuck.total);
      if (sent) {
        state[rule.key] = {
          since: stuck.tasks[0].createdAt,
          count: stuck.total,
          stuckActions: _.uniq(_.map(stuck.tasks, "action")),
          firstSentAt: now,
          lastSentAt: now,
        };
        stateChanged = true;
      }
    } else if (isStuck && isActive) {
      const alertState = state[rule.key];
      const lastSentAt = alertState.lastSentAt ?? alertState.since;
      const minutesSinceLastEmail = differenceInMinutes(
        new Date(),
        parseJSON(lastSentAt),
      );
      if (minutesSinceLastEmail >= getReminderHours(rule) * 60) {
        const sent = await sendAlert(
          rule,
          stuck.tasks,
          stuck.total,
          alertState,
        );
        if (sent) {
          alertState.lastSentAt = now;
          stateChanged = true;
        }
      }
    } else if (!isStuck && isActive) {
      logger.info(`System alert "${rule.key}" has cleared`);
      delete state[rule.key];
      stateChanged = true;
    }
  }

  // drop alerts for rules that were renamed or removed
  const ruleKeys = _.map(alertRules, "key");
  const staleKeys = _.difference(_.keys(state), ruleKeys);
  if (staleKeys.length && !scriptKeySpecified("emailtest")) {
    staleKeys.forEach((key) => delete state[key]);
    stateChanged = true;
  }

  if (stateChanged) {
    try {
      await writeAlertState(state);
    } catch (error) {
      logger.error(
        `checkSystemAlerts() failed to save the alert state: ${error}`,
      );
    }
  }
};

module.exports = { checkSystemAlerts };
