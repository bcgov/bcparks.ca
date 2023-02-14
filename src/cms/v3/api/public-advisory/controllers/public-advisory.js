"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { advisoryNumber } = ctx.params;
    const entity = await strapi.services["public-advisory"].findOne({
      advisoryNumber,
    });
    if (entity) {
      const { description = "", standardMessages } = entity;
      if (standardMessages.length > 0) {
        entity.description = (
          description +
          " " +
          standardMessages.map((m) => m.description).join(" ")
        ).trim();
      }
    }
    return sanitizeEntity(entity, {
      model: strapi.contentTypes["public-advisory"],
    });
  },
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services["public-advisory"].search(ctx.query);
    } else {
      entities = await strapi.services["public-advisory"].find(ctx.query);
    }
    return entities.map((entity) => {
      const publicAdvisory = sanitizeEntity(entity, {
        model: strapi.contentTypes["public-advisory"],
      });
      if (publicAdvisory) {
        const { description = "", standardMessages } = publicAdvisory;
        if (standardMessages.length > 0) {
          publicAdvisory.description = (
            description +
            " " +
            standardMessages.map((m) => m.description).join(" ")
          ).trim();
        }
      }
      return publicAdvisory;
    });
  },
};
