const path = require("node:path");
const { mkdir, readFile, rename, writeFile } = require("node:fs").promises;
const { getLogger } = require("../../shared/logging");

const STATE_FILE_NAME = "system-alerts.json";

/**
 * Returns the full path of the alert state file. It lives in
 * PERSISTENT_DATA_DIR (a PVC on OpenShift) so it survives pod restarts.
 *
 * @returns {string} Path to the state file.
 */
const getStateFilePath = function () {
  return path.join(
    process.env.PERSISTENT_DATA_DIR || "./data",
    STATE_FILE_NAME,
  );
};

/**
 * Reads which alerts have already been sent.
 *
 * @returns {Promise<Object<string, {since: string, count: number, stuckActions: string[], firstSentAt: string, lastSentAt: string}>>}
 *   Active alerts keyed by rule key. Empty when the file is missing or
 *   unreadable.
 */
const readAlertState = async function () {
  const filePath = getStateFilePath();
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") {
      getLogger().warn(
        `Could not read ${filePath}, starting with no active alerts: ${error}`,
      );
    }
    return {};
  }
};

/**
 * Saves which alerts have been sent. Writes to a temp file and renames it so
 * a crash never leaves a half-written state file.
 *
 * @param {Object<string, {since: string, count: number, stuckActions: string[], firstSentAt: string, lastSentAt: string}>} state
 *   Active alerts keyed by rule key.
 * @returns {Promise<void>} Resolves when the file has been written.
 */
const writeAlertState = async function (state) {
  const filePath = getStateFilePath();
  const tempPath = `${filePath}.tmp`;
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(tempPath, JSON.stringify(state, null, 2));
  await rename(tempPath, filePath);
};

module.exports = {
  readAlertState,
  writeAlertState,
};
