/**
 * Strapi 5 lifecycle hooks for Document Service
 * Migration Guide: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service
 * Document Service API: https://docs.strapi.io/cms/api/document-service
 */

"use strict";

const validator = require("../../../../helpers/validator.js");
const disabled = process.env.DISABLE_LIFECYCLES === "true";

module.exports = {
  async beforeCreate(event) {
    if (disabled) return;
    let { data } = event.params;
    validator.activityTypeValidator(data.activityType);
    validator.protectedAreaOrSiteValidator(data.protectedArea, data.site);
  },
  async beforeUpdate(event) {
    if (disabled) return;
    let { data } = event.params;
    validator.activityTypeValidator(data.activityType);
    validator.protectedAreaOrSiteValidator(data.protectedArea, data.site);
  },
};
