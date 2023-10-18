"use strict";
/**
 * public-advisory-audit controller
 */

const { sanitize } = require('@strapi/utils');
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::public-advisory-audit.public-advisory-audit",
  ({ strapi }) => ({
    async history(ctx) {
      const { advisoryNumber } = ctx.params;
      const entities = await strapi.service("api::public-advisory-audit.public-advisory-audit").find({
        filters: { advisoryNumber: advisoryNumber },
        sort: ['revisionNumber:desc'],
        publicationState: "preview",
        populate: "*"
      });

      // remove createdBy and updatedBy because it's easier to maintain than 
      // changing populate: "*" to include everything else but these fields.
      for (const version of entities.results) {
        delete version.createdBy;
        delete version.updatedBy;
      };

      return this.sanitizeOutput(entities.results, ctx);
    }
  })
);
