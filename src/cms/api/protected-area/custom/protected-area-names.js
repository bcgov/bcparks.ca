"use strict";
const { sanitizeEntity } = require("strapi-utils");

const getParkNames = async () => {
  const parkNameData = await strapi.services["park-name"].find({
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
};

// custom route for park id and name only
const getProtecteAreaNames = async (ctx) => {
  const parkNamesData = await getParkNames();
  let entities;
  if (ctx.query._q) {
    entities = await strapi.services["protected-area"].search(ctx.query);
  } else {
    entities = await strapi.services["protected-area"].find(ctx.query);
  }

  return entities.map((entity) => {
    const { id, orcs, type, typeCode, protectedAreaName } = sanitizeEntity(
      entity,
      {
        model: strapi.models["protected-area"],
      }
    );
    const parkNamesFilter = parkNamesData.filter((x) => x.orcs == orcs);

    const parkNames =
      parkNamesFilter.length !== 0 ? parkNamesFilter[0].parkNames : [];

    return { id, orcs, type, typeCode, protectedAreaName, parkNames };
  });
};

module.exports = {
  getProtecteAreaNames,
};
