const path = require("node:path");
const {
  appendFileSync,
  mkdirSync,
  statSync,
  writeFileSync,
} = require("node:fs");
const { rm } = require("node:fs").promises;

// The scheduler runs once a minute, so a file written in the last 10 seconds
// is from the current run
const RECENT_MS = 10 * 1000;

/**
 * Returns the folder that holds the last error for each queued task. It lives
 * in PERSISTENT_DATA_DIR (a PVC on OpenShift) so it survives pod restarts.
 *
 * @returns {string} Path to the task errors folder.
 */
const getTaskErrorsDir = function () {
  return path.join(process.env.PERSISTENT_DATA_DIR || "./data", "task-errors");
};

/**
 * Saves an error for a queued task in <documentId>.txt. If the file was
 * written in the last 10 seconds (the current scheduler run), the message is
 * appended on a new line. Otherwise the file is replaced, so it always holds
 * the errors from the task's most recent failed run. Uses sync writes so
 * errors logged back to back are saved in order.
 *
 * @param {string} documentId Strapi documentId of the queued task.
 * @param {string} message Error message to save.
 * @returns {void}
 */
const writeTaskError = function (documentId, message) {
  const dir = getTaskErrorsDir();
  const filePath = path.join(dir, `${documentId}.txt`);
  mkdirSync(dir, { recursive: true });

  let isRecent = false;
  try {
    isRecent = Date.now() - statSync(filePath).mtimeMs < RECENT_MS;
  } catch {
    // no file yet
  }

  if (isRecent) {
    appendFileSync(filePath, `\n${message}`);
  } else {
    writeFileSync(filePath, message);
  }
};

/**
 * Deletes all saved task errors.
 *
 * @returns {Promise<void>} Resolves when the folder has been removed.
 */
const clearTaskErrors = async function () {
  await rm(getTaskErrorsDir(), { recursive: true, force: true });
};

module.exports = {
  writeTaskError,
  clearTaskErrors,
};
