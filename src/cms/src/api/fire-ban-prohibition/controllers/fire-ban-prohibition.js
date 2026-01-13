"use strict";

const _ = require("lodash");

/**
 * fire-ban-prohibition controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::fire-ban-prohibition.fire-ban-prohibition",
  ({ strapi }) => ({
    async propagate(ctx) {

      let before = [];
      let after = [];

      try {
        before = await strapi
          .service("api::fire-ban-prohibition.fire-ban-prohibition")
          .getAllProtectedAreaFireBans();
      } catch (error) {
        return ctx.internalServerError(
          "Error in service fire-ban-prohibition:getAllProtectedAreaFireBans()",
          error.message
        );
      }

      try {
        await strapi
          .service("api::fire-ban-prohibition.fire-ban-prohibition")
          .rescindAllProtectedAreaFireBans();
      } catch (error) {
        return ctx.internalServerError(
          "Error in service fire-ban-prohibition:rescindAllProtectedAreaFireBans()",
          error.message
        );
      }

      let result;

      try {
        result = await strapi
          .service("api::fire-ban-prohibition.fire-ban-prohibition")
          .generateAllProtectedAreaFireBans();
      } catch (error) {
        return ctx.internalServerError(
          "Error in service fire-ban-prohibition:generateAllProtectedAreaFireBans()",
          error.message
        );
      }

      try {
        after = await strapi
          .service("api::fire-ban-prohibition.fire-ban-prohibition")
          .getAllProtectedAreaFireBans();
      } catch (error) {
        return ctx.internalServerError(
          "Error in service fire-ban-prohibition:getAllProtectedAreaFireBans()",
          error.message
        );
      }

      const updatedParks = _.difference(before, after).concat(_.difference(after, before))

      const queueList = updatedParks.map(p => {
        return {
          action: 'elastic index park',
          numericData: p
        }
      });

      if (queueList.length) {
        for (const task of queueList) {
          await strapi.documents("api::queued-task.queued-task").create({ data: task });
        }
      }

      const cachePlugin = strapi.plugins["rest-cache"];
      if (cachePlugin) {
        await cachePlugin.services.cacheStore.clearByUid('api::protected-area.protected-area');
        await cachePlugin.services.cacheStore.clearByUid('api::park-access-status.park-access-status');
        await cachePlugin.services.cacheStore.clearByUid('api::public-advisory.public-advisory');
      }

      ctx.send({
        message: `Propagation complete! ${result.campfireBanCount} campfire bans impacting ${result.parkCount} protected areas.`
      }, 201);
    }
  })
);
