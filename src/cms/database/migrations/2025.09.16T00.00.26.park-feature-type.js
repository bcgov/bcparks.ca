"use strict";

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
