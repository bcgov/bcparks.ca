"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async names() {
    const parkNameData = await strapi.query("park-name").find({
      _limit: -1,
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
};
