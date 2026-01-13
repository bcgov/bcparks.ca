'use strict';

/**
 * search service
 */

module.exports = ({ strapi }) => ({

  async queueAllParksForIndexing() {

    // clear items that are already queued to be indexed (they don't need to be indexed twice)
    const tasks = await strapi.documents("api::queued-task.queued-task").findMany({
      filters: { action: 'elastic index park' },
      fields: ["id"]
    });

    for (const task of tasks) {
      try {
        await strapi.documents("api::queued-task.queued-task").delete({ documentId: task.documentId });
      } catch (error) {
        strapi.log.error(`Error deleting queued task ${task.id}:`, error);
      }
    }

    // items queued to be deleted are okay to be deleted twice because there is a big risk of
    // missing them if we delete them as well

    const removeParks = await strapi.documents("api::protected-area.protected-area").findMany({
      filters: { isDisplayed: { $ne: true } },
      fields: ["id"]
    });

    const addParks = await strapi.documents("api::protected-area.protected-area").findMany({
      filters: { isDisplayed: true },
      fields: ["id"]
    });

    const removeList = removeParks.map(p => {
      return {
        action: 'elastic remove park',
        numericData: p.id
      }
    });

    const addList = addParks.map(p => {
      return {
        action: 'elastic index park',
        numericData: p.id
      }
    });

    if (removeList.length) {
      for (const task of removeList) {
        await strapi.documents("api::queued-task.queued-task").create({ data: task });
      }
    }

    if (addList.length) {
      for (const task of addList) {
        await strapi.documents("api::queued-task.queued-task").create({ data: task });
      }
    }
  }

});
