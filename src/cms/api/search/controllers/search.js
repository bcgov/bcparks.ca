'use strict';

/**
 * A set of functions called "actions" for `search`
 */

module.exports = {
  async generateView (ctx, next) {
    const entities = await strapi.query("protected-area").find({ _limit: -1 });

    console.log("Length:", entities.length)

    // Delete existing
    await strapi.services["search-view"].delete({ })

    console.log("Creating new view");

      // Add parkactivities/parkfacilities
    for (let i = 0;i < entities.length;i++) {
      let parkactivites = await strapi.query("park-activity").find({ _limit: -1, "protectedArea.protectedAreaName": entities[i].protectedAreaName});
      let parkActivityNames = parkactivites.map(activity => {
        return activity.activityType.activityName;
      });
      entities[i].parkactivities = [ ...new Set(parkActivityNames)];

      let parkfacilities = await strapi.query("park-facility").find({ _limit: -1, "protectedArea.protectedAreaName": entities[i].protectedAreaName});
      let parkFacilityNames = parkfacilities.map(activity => {
        if (activity && activity.facilityType) {
          return activity.facilityType.facilityName;
        } else {
          console.log("Couldn't add activity:", activity.id)
          console.log(activity)
        }
      })
      entities[i].parkfacilities = [ ...new Set(parkFacilityNames)];
      // Insert into new collection
      strapi.query("search-view").create(entities[i])
    }

    return entities;
  },
};
