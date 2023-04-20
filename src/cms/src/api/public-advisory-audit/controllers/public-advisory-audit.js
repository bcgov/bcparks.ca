"use strict";
const { sanitize } = require('@strapi/utils');


/**
 * public-advisory-audit controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::public-advisory-audit.public-advisory-audit",
  ({ strapi }) => ({
    async create(ctx) {
      const cachePlugin = strapi.plugins["rest-cache"];
      if (cachePlugin) {
        // clear the redis rest-cache when updates are made from the staff portal
        cachePlugin.services.cacheStore.clearByUid('api::protected-area.protected-area');
      }
      const response = await super.create(ctx);
      return response;
    },
    async update(ctx) {
      const cachePlugin = strapi.plugins["rest-cache"];
      if (cachePlugin) {
        // clear the redis rest-cache when updates are made from the staff portal
        cachePlugin.services.cacheStore.clearByUid('api::protected-area.protected-area');
        cachePlugin.services.cacheStore.clearByUid('api::public-advisory.public-advisory');
      }
      const response = await super.update(ctx);
      return response;
    },
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
