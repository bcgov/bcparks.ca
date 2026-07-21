const { getLogger } = require("../../shared/logging");
const { readQueue, removeFromQueue } = require("../../shared/taskQueue");
const { recSpaceAxios } = require("../utils/axiosRecSpaceAuth");

/**
 * Posts a public advisory payload to the RecSpace API.
 */
async function postRecSpacePublicAdvisory(payload) {
  const logger = getLogger();
  try {
    await recSpaceAxios.post("/api/v1/act/advisories", payload);
    logger.info(
      `Advisory ${payload.advisory_number} with rec_resource_id ${payload.rec_resource_id} posted successfully`,
    );
  } catch (error) {
    logger.error(
      `postRecSpacePublicAdvisory() failed for advisory ${payload.advisory_number} with rec_resource_id ${payload.rec_resource_id}: ${error?.message ?? error}`,
    );
    if (error?.response?.data) {
      logger.error(`Response body: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

/**
 * Deletes a public advisory from the RecSpace API.
 */
async function deleteRecSpacePublicAdvisory(advisoryNumber, recResourceId) {
  const logger = getLogger();
  try {
    await recSpaceAxios.delete(
      `/api/v1/act/advisories/${recResourceId}/${advisoryNumber}`,
    );
    logger.info(
      `Advisory ${advisoryNumber} with rec_resource_id ${recResourceId} deleted successfully`,
    );
  } catch (error) {
    if (error?.response?.status === 404) {
      logger.info(
        `Advisory ${advisoryNumber} with rec_resource_id ${recResourceId} not found (404), skipping`,
      );
      return;
    }

    logger.error(
      `deleteRecSpacePublicAdvisory() failed for advisory ${advisoryNumber} with rec_resource_id ${recResourceId}: ${error?.message ?? error}`,
    );
    throw error;
  }
}

/**
 * Processes `recspace publish advisory` queued tasks and syncs to RecSpace
 */
exports.publishToRecSpace = async function () {
  let queue;
  const logger = getLogger();

  // get items from the queue with the action 'recspace publish advisory'
  try {
    queue = await readQueue("recspace publish advisory");
  } catch (error) {
    logger.error(
      `publishToRecSpace() failed while retrieving 'recspace publish advisory' tasks: ${error}`,
    );
    return;
  }

  for (const message of queue) {
    try {
      const advisoryNumber = message?.numericData;
      const beforeJsonData = message?.jsonData?.before;
      const afterJsonData = message?.jsonData?.after;

      const beforeRecResourceIds = beforeJsonData?.rec_resource_ids || [];
      const afterRecResourceIds = afterJsonData?.rec_resource_ids || [];

      // determine which rec_resource_ids were removed
      const removedRecResourceIds = beforeRecResourceIds.filter(
        (id) => !afterRecResourceIds.includes(id),
      );

      // determine the before and after status of the advisory
      const beforeStatus = beforeJsonData?.advisory_status || null;
      const afterStatus = afterJsonData?.advisory_status || null;

      if (beforeStatus === "Published" && afterStatus === "Scheduled") {
        // This is a special case, so do nothing. The "before" advisory is still published
        // in the public-advisories collection and the "after" is just a draft scheduled
        // for future publication.
        await removeFromQueue([message.documentId]);
        continue;
      }

      // if the after status is "Scheduled" or "Published" then we need to send a POST request
      // to the API for each recResourceId in the after payload
      // Note: POST endpoint performs upsert, so PUT is unnecessary
      if (afterStatus === "Scheduled" || afterStatus === "Published") {
        const { revision_number, rec_resource_ids, ...basePayload } =
          afterJsonData;

        for (const recResourceId of rec_resource_ids || []) {
          const payload = { ...basePayload, rec_resource_id: recResourceId };
          await postRecSpacePublicAdvisory(payload);
        }

        // if any recResourceIds were removed then we need to send a DELETE request
        // to the API for each recResourceId in the removedRecResourceIds
        for (const recResourceId of removedRecResourceIds) {
          await deleteRecSpacePublicAdvisory(advisoryNumber, recResourceId);
        }
      } else {
        // if the after status is anything else then we need to send a DELETE request
        // to the API for each recResourceId in the before payload
        for (const recResourceId of beforeJsonData?.rec_resource_ids || []) {
          await deleteRecSpacePublicAdvisory(advisoryNumber, recResourceId);
        }
      }

      await removeFromQueue([message.documentId]);
    } catch (error) {
      logger.error(
        `publishToRecSpace() failed while processing advisory ${message?.numericData}: ${error}`,
      );
    }
  }
};
