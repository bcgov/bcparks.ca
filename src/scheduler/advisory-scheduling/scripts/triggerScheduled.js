const { cmsAxios } = require("../../shared/axiosConfig");
const { getLogger } = require("../../shared/logging");

/**
 * Updates public advisories set for automatic publishing or expiry
 */
exports.triggerAdvisories = async function () {
  const logger = getLogger();
  try {
    await cmsAxios.post("/api/public-advisories/trigger-scheduled", {});
  } catch (error) {
    logger.error(`advisory-scheduling/scripts/triggerScheduled.js failed: ${error}`);
  }
};
