const { addToQueue, removeFromQueue } = require("../../shared/taskQueue");
const { tryGetOrcs } = require("../utils/helper");

exports.dootSplitMessage = async function (message) {
  let splitOk = true;

  // add the individual items back into the queue
  for (const item of message?.jsonData) {
    try {
      await addToQueue({
        data: {
          action: "doot publish",
          numericData: tryGetOrcs(item),
          jsonData: [item],
        },
      });
    } catch (error) {
      splitOk = false;
      throw new Error(`dootPublish() failed adding split message to queue failed: ${error}`);
    }
  }

  // if all the new messages were added successfully, then remove the original
  // message from the queue
  if (splitOk) {
    try {
      await removeFromQueue([message.documentId]);
    } catch (error) {
      throw new Error(`dootPublish() failed removing original message from queue: ${error}`);
    }
  }
};
