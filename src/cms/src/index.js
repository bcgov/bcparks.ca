"use strict";
const elasticClient = require("./helpers/elasticClient");
const searchIndexingMiddleware = require("./middlewares/search-indexing.js");
const restCacheInvalidationMiddleware = require("./middlewares/rest-cache-invalidation.js");
const nameGeneratorMiddleware = require("./middlewares/name-generator.js");
const photoRelationSyncMiddleware = require("./middlewares/photo-relation-sync.js");
const staffPortalAdvisoryAuditMiddleware = require("./middlewares/staff-portal-advisory-audit.js");
const authStrategyOverride = require("./extensions/users-permissions/strategies/keycloak-users-permissions");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    // configure the documentation plugin to ignore some content types
    strapi
      .plugin("documentation")
      .service("override")
      .excludeFromGeneration([
        "public-advisory-audit",
        "queued-task",
        "search-indexing",
        "statutory-holiday",
        "geo-shape",
        "search-city",
        "footer-menu",
        "menu",
      ]);

    if (process.env.DISABLE_LIFECYCLES === "true") {
      strapi.log.warn("🚫 Lifecycles disabled via DISABLE_LIFECYCLES");
      return; // Do not register any document service middleware
    }

    // register document service middlewares
    const middlewares = [
      searchIndexingMiddleware,
      restCacheInvalidationMiddleware,
      nameGeneratorMiddleware,
      photoRelationSyncMiddleware,
      staffPortalAdvisoryAuditMiddleware,
    ];
    middlewares.forEach((middleware) => {
      strapi.documents.use(middleware(strapi));
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    elasticClient.initializeESClient();

    // Register Keycloak authentication strategy
    const authService = strapi.get("auth");
    if (authService) {
      authService.register("content-api", authStrategyOverride);
    }

    // Trigger API documentation generation in production.
    // Automatic generation was disabled in Strapi PR #21950.
    // Note: The documentation plugin is not officially supported in Strapi 5.
    if (process.env.NODE_ENV === "production") {
      const svc = strapi.plugin("documentation")?.service("documentation");
      if (svc) {
        await svc.generateFullDoc();
      }
    }
  },
};
