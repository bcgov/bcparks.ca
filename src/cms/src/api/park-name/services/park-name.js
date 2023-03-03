"use strict";

/**
 * park-name service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::park-name.park-name",
  ({ strapi }) => ({
    async names() {
      const parkNameData = await strapi.db
        .query("api::park-name.park-name")
        .findMany({
          populate: true,
        });

      return Object.entries(
        parkNameData.reduce((acc, parkName) => {
          if (parkName.protectedArea && parkName.parkNameType) {
            acc[parkName.protectedArea.orcs] = [
              ...(acc[parkName.protectedArea.orcs] || []),
              {
                parkName: parkName.parkName,
                nameTypeId: parkName.parkNameType.nameTypeId,
                nameType: parkName.parkNameType.nameType,
              },
            ];
          }
          return acc;
        }, {})
      ).map(([key, value]) => ({ orcs: key, parkNames: value }));
    },
    async items() {
      const parkNameData = await strapi.db
        .query("api::park-name.park-name")
        .findMany({
          populate: true,
        });

      return parkNameData.map(
        ({ parkName, id, parkNameType, protectedArea }) => ({
          id,
          parkName,
          parkNameType: {
            nameTypeId: parkNameType?.nameTypeId,
            nameType: parkNameType?.nameType,
          },
          protectedArea: {
            orcs: protectedArea?.orcs,
            id: protectedArea?.id,
          },
        })
      );
    },
  })
);
