"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async history(ctx) {
    const { advisoryNumber } = ctx.params;
    const entities = await strapi.services["public-advisory-audit"].find({
      advisoryNumber_in: [advisoryNumber],
      _sort: "revisionNumber:desc",
      _publicationState: "preview",
    });
    return entities.map((entity) =>
      sanitizeEntity(entity, {
        model: strapi.contentTypes["public-advisory-audit"],
      })
    );
  },
};
