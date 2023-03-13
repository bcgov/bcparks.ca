"use strict";
const { sanitize } = require('@strapi/utils');


/**
 * public-advisory-audit controller
 */

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

      return sanitize.contentAPI.output(entities.results);
    }
  }
  )
);
