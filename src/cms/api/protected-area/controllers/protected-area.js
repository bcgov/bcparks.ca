"use strict";
const { sanitizeEntity } = require("strapi-utils");
const customStatus = require("../custom/protected-area-status");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { orcs } = ctx.params;
    const entity = await strapi.services["protected-area"].findOne({ orcs });
    return sanitizeEntity(entity, { model: strapi.models["protected-area"] });
  },
  async names(ctx) {
    // custom route for basic park details with park names
    const parkNamesData = await strapi.services["park-name"].names();
    const entities = await strapi.services["protected-area"].names(ctx);
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
  },
  async items() {
    // custom route for light weight park details used in client app
    const entities = await strapi.services["protected-area"].items();
    return entities.map((entity) => {
      const { id, orcs, protectedAreaName } = sanitizeEntity(entity, {
        model: strapi.models["protected-area"],
      });
      return { id, orcs, protectedAreaName };
    });
  },
  async status(ctx) {
    return customStatus.getProtectedAreaStatus(ctx);
  },
};
