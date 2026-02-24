"use strict";

/**
 * public-advisory controller
 */

const { sanitize } = require("@strapi/utils");
const { createCoreController } = require("@strapi/strapi").factories;

const populateStandardMessages = function (query) {
  // Set default populate if not specified
  if (!query.populate) {
    query.populate = "*";
  }

  if (query.populate !== "*") {
    query = {
      ...query,
      ...{
        populate: {
          ...query.populate,
          ...{
            standardMessages: { fields: ["title", "description"] },
          },
        },
      },
    };
  }
  return query;
};

const appendStandardMessages = function (entity) {
  if (entity) {
    const { description = "", standardMessages } = entity;
    let content = description ? `<div>${description}</div>` : "";
    if (standardMessages && standardMessages.length > 0) {
      content += standardMessages
        .map((m) => `<div>${m.description}</div>`)
        .join(" ");
    }
    entity.description = content.trim();
  }
  return entity;
};

module.exports = createCoreController(
  "api::public-advisory.public-advisory",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { id } = ctx.params;

      // look up the public advisory by the advisory number
      const entity = await strapi
        .documents("api::public-advisory.public-advisory")
        .findFirst({
          filters: { advisoryNumber: id },
          ...ctx.query
        });

      if (!entity) {
        return ctx.notFound();
      }

      ctx.query = populateStandardMessages(ctx.query);


    // append the standardMessages to the description and then delete them from the entity
      const result = appendStandardMessages(entity);
      delete result.standardMessages;

      return this.sanitizeOutput(result, ctx);
    },
    async find(ctx) {
      let entities;
      let pagination;

      ctx.query.status = "published";
      ctx.query = populateStandardMessages(ctx.query);

      if (ctx.query.queryText !== undefined) {
        ({ results: entities } = await strapi
          .service("api::public-advisory.search")
          .search(ctx.query));
        pagination = {};
      } else {
        ({ results: entities, pagination } = await strapi
          .service("api::public-advisory.public-advisory")
          .find(ctx.query));
      }

      const sanitizedEntities = await this.sanitizeOutput(entities, ctx);

      const results = sanitizedEntities.map((entity) => {
        entity = appendStandardMessages(entity);
        delete entity.standardMessages;
        return entity;
      });

      return {
        data: results || [],
        meta: { pagination: pagination },
      };
    },
    async count(ctx) {
      ctx.query.status = "published";
      if (ctx.query.queryText !== undefined) {
        return await strapi
          .service("api::public-advisory.search")
          .countSearch(ctx.query);
      }
      return (
        await strapi
          .service("api::public-advisory.public-advisory")
          .find(ctx.query)
      ).pagination.total;
    },
    async items(ctx) {
      let entities;
      let pagination;

      ctx.query.status = "published";
      ctx.query.populate = {
        accessStatus: {
          fields: [
            "accessStatus",
            "precedence",
            "color",
            "groupLabel",
            "hidesSeasonalAdvisory",
          ],
        },
        eventType: { fields: ["eventType", "precedence"] },
        urgency: { fields: ["urgency", "code", "sequence", "color"] },
        advisoryStatus: { fields: ["advisoryStatus", "code"] },
        links: { fields: "*" },
        standardMessages: { fields: "*" },
        sites: {
          fields: ["orcsSiteNumber", "siteName"],
          filters: { isDisplayed: true },
        },
      };

      ({ results: entities, pagination } = await strapi
        .service("api::public-advisory.public-advisory")
        .find(ctx.query));

      const sanitizedEntities = await this.sanitizeOutput(entities, ctx);

      const results = sanitizedEntities.map((entity) => {
        entity = appendStandardMessages(entity);
        delete entity.standardMessages;
        return entity;
      });

      return {
        data: results || [],
        meta: { pagination: pagination },
      };
    },
    async getAccessStatusesByProtectedArea(ctx) {
      const entries = await strapi
        .documents("api::public-advisory.public-advisory")
        .findMany({
          fields: ["id"],
          populate: {
            accessStatus: { fields: ["id"] },
            protectedAreas: { fields: ["id"] },
          },
        });
      const results = {};
      for (const advisory of entries) {
        if (advisory.accessStatus) {
          for (const pa of advisory.protectedAreas) {
            if (!results[pa.id]) {
              results[pa.id] = [{ accessStatusId: advisory.accessStatus.id }];
            } else {
              if (
                !results[pa.id].find(
                  (x) => x.accessStatusId === advisory.accessStatus.id,
                )
              ) {
                results[pa.id].push({
                  accessStatusId: advisory.accessStatus.id,
                });
              }
            }
          }
        }
      }
      return results;
    },
    async triggerScheduled(ctx) {
      const advisoryStatusMap = await strapi
        .service("api::public-advisory.scheduling")
        .getAdvisoryStatusMap();
      const publishedCount = await strapi
        .service("api::public-advisory.scheduling")
        .publish(advisoryStatusMap);
      const expiredCount = await strapi
        .service("api::public-advisory.scheduling")
        .expire(advisoryStatusMap);
      const expiringSoonCount = await strapi
        .service("api::public-advisory.scheduling")
        .expiringSoon(advisoryStatusMap);
      const publishingSoonCount = await strapi
        .service("api::public-advisory.scheduling")
        .publishingSoon(advisoryStatusMap);

      const cachePlugin = strapi.plugins["rest-cache"];
      if (cachePlugin && (publishedCount > 0 || expiredCount > 0)) {
        await cachePlugin.services.cacheStore.clearByUid(
          "api::public-advisory.public-advisory",
        );
        await cachePlugin.services.cacheStore.clearByUid(
          "api::protected-area.protected-area",
        );
      }

      ctx.send(
        {
          message: `Scheduled public advisory processing complete. ${publishedCount} published. ${expiredCount} expired. ${expiringSoonCount} expiring soon. ${publishingSoonCount} publishing soon.`,
        },
        201,
      );
    },
  }),
);
