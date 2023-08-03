module.exports = {
  indexPark: async function (id) {
    if (!id) {
      return;
    }
    const exists = (await strapi.entityService.findMany('api::queued-task.queued-task', {
      filters: {
        action: 'elastic index park',
        numericData: id
      }
    })).length > 0;
    if (!exists) {
      strapi.log.info(`queued protectedArea ${id} for reindexing`)
      await strapi.entityService.create('api::queued-task.queued-task', {
        data: {
          action: 'elastic index park',
          numericData: id
        }
      })
    }
  },
  removePark: async function (id) {
    if (!id) {
      return;
    }
    const exists = (await strapi.entityService.findMany('api::queued-task.queued-task', {
      filters: {
        action: 'elastic remove park',
        numericData: id
      }
    })).length > 0;
    if (!exists) {
      strapi.log.info(`queued protectedArea ${id} for removal`)
      await strapi.entityService.create('api::queued-task.queued-task', {
        data: {
          action: 'elastic remove park',
          numericData: id
        }
      })
    }
  }
}