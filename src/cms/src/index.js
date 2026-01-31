"use strict";
const elasticClient = require("./helpers/elasticClient");
const {
  searchIndexingMiddleware,
} = require("./document-middlewares/search-indexing.js");
const restCacheInvalidationMiddleware = require("./document-middlewares/rest-cache-invalidation.js");
const nameGeneratorMiddleware = require("./document-middlewares/name-generator.js");
const photoRelationSyncMiddleware = require("./document-middlewares/photo-relation-sync.js");
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

    // register document service middlewares
    const middlewares = [
      searchIndexingMiddleware,
      restCacheInvalidationMiddleware,
      nameGeneratorMiddleware,
      photoRelationSyncMiddleware,
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
  bootstrap({ strapi }) {
    elasticClient.initializeESClient();

    // Register Keycloak authentication strategy
    const authService = strapi.get("auth");
    if (authService) {
      authService.register("content-api", authStrategyOverride);
    }
  },
};
