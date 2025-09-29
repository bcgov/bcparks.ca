"use strict";

const parkFeatureTypeMap = {
  Anchorage: 1,
  Backcountry: 2,
  "Boat launch": 3,
  Cabin: 4,
  Dock: 5,
  "Frontcountry campground": 6,
  "Group campground": 7,
  "Hot spring": 8,
  Hut: 9,
  "Marine-accessible camping": 10,
  "Mooring buoy": 11,
  "Picnic area": 12,
  "Picnic shelter": 13,
  Resort: 14,
  Shelter: 15,
  Trail: 16,
  "Walk-in camping": 17,
  "Wilderness camping": 18,
  "Winter camping": 19,
};

module.exports = {
  async up(knex) {
    if (await knex.schema.hasTable("park_feature_types")) {
      // Fetch all records from park-operation-sub-area-type
      const subAreaTypes = await strapi.entityService.findMany(
        "api::park-operation-sub-area-type.park-operation-sub-area-type",
        {
          populate: ["facilityType", "campingType"],
        }
      );

      // Prepare data for park-feature-type
      const featureTypes = subAreaTypes.map((type) => {
        return {
          parkFeatureType: type.subAreaType,
          closureAffectsAccessStatus: type.closureAffectsAccessStatus,
          campingType: type.campingType
            ? { connect: [{ id: type.campingType.id }] }
            : undefined,
          facilityType: type.facilityType
            ? { connect: [{ id: type.facilityType.id }] }
            : undefined,
          featureTypeId: parkFeatureTypeMap[type.subAreaType] || null,
          publishedAt: new Date().toISOString(),
        };
      });

      // Insert data into park-feature-type
      if (featureTypes.length > 0) {
        for (const featureType of featureTypes) {
          await strapi.entityService.create(
            "api::park-feature-type.park-feature-type",
            { data: featureType }
          );
        }
      }
    }
  },
};
