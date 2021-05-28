"use strict";
const { sanitizeEntity } = require("strapi-utils");

// custom route for park id and name only
const getProtecteAreaNames = async (ctx) => {
  let entities;
  if (ctx.query._q) {
    entities = await strapi.services["protected-area"].search(ctx.query);
  } else {
    entities = await strapi.services["protected-area"].find(ctx.query);
  }

  return entities.map((entity) => {
    const { id, protectedAreaName } = sanitizeEntity(entity, {
      model: strapi.models["protected-area"],
    });

    return { id, protectedAreaName };
  });
};

module.exports = {
  getProtecteAreaNames,
};
