"use strict";
/**
 * public-advisory-audit controller
 */

const { sanitize } = require('@strapi/utils');
const { createCoreController } = require("@strapi/strapi").factories;

const clearRestCache = async function () {
  const cachePlugin = strapi.plugins["rest-cache"];
  if (cachePlugin) {
    // clear the redis rest-cache when updates are made from the staff portal
    await cachePlugin.services.cacheStore.clearByUid('api::protected-area.protected-area');
    await cachePlugin.services.cacheStore.clearByUid('api::public-advisory.public-advisory');
  }
}

module.exports = createCoreController(
  "api::public-advisory-audit.public-advisory-audit",
  ({ strapi }) => ({
    async create(ctx) {
      await clearRestCache();
      const response = await super.create(ctx);
      return response;
    },
    async update(ctx) {
      await clearRestCache();
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
