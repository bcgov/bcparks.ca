'use strict';

/**
 * search service
 */

module.exports = ({ strapi }) => ({

  async queueAllParksForIndexing() {

    // clear items that are already queued to be indexed (they don't need to be indexed twice)
    await strapi.db.query("api::queued-task.queued-task").deleteMany({
      where: { action: 'elastic index park' }
    });

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
      await strapi.db.query("api::queued-task.queued-task").createMany({ data: removeList });
    }

    if (addList.length) {
      await strapi.db.query("api::queued-task.queued-task").createMany({ data: addList });
    }
  }

});
