"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const currentYear = new Date().getFullYear();

const updateParkOperationDates = async (where) => {
  try {
    const subAreaDate = await strapi.entityService.findOne(
      "api::park-operation-sub-area-date.park-operation-sub-area-date", where.id, { populate: '*' }
    )
    const subArea = await strapi.entityService.findOne(
      "api::park-operation-sub-area.park-operation-sub-area", subAreaDate.parkOperationSubArea.id, { populate: '*' }
    )
    const protectedArea = await strapi.entityService.findOne(
      "api::protected-area.protected-area", subArea.protectedArea.id, { populate: '*' }
    )
    const getPopulatedSubAreas = (subAreas) => {
      const promises = subAreas.map(async (subArea) => {
        return await strapi.entityService.findOne(
          "api::park-operation-sub-area.park-operation-sub-area", subArea.id, { populate: '*' }
        )
      })
      return Promise.all(promises);
    }
    const populateSubAreas = await getPopulatedSubAreas(protectedArea.parkOperationSubAreas)

    // get openDate and closeDate from all park-operation-sub-area/park-operation-sub-area-date
    let openDates = []
    let closeDates = []
    populateSubAreas.map(subArea =>
      subArea.parkOperationSubAreaDates.map(subAreaDate => {
        if (subAreaDate.isActive && subAreaDate.operatingYear === currentYear) {
          openDates.push(subAreaDate.openDate)
          closeDates.push(subAreaDate.closeDate)
        }
      })
    )
    openDates.sort()
    closeDates.sort()
    let firstOpenDate = openDates[0]
    let lastCloseDate = closeDates[closeDates.length - 1]
    // check if the firstDate is before currentYear
    if (firstOpenDate <= `${currentYear}-01-01`) {
      firstOpenDate = `${currentYear}-01-01`
    }
    // check if the lastDate is after currentYear
    if (lastCloseDate >= `${Number(currentYear)+1}-01-01`) {
      lastCloseDate = `${currentYear}-12-31`
    }
    
    // update park-operation with earliest openDate and latest closeDate
    await strapi.entityService.update(
      "api::park-operation.park-operation", protectedArea.parkOperation.id, {
      data: {
        openDate: firstOpenDate,
        closeDate: lastCloseDate
      }
    })
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;
    if (data.isActive && data.operatingYear === currentYear) {
      updateParkOperationDates(where)
    }
  }
};
