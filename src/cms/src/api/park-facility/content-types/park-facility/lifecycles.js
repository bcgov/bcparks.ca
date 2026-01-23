/**
 * Strapi 5 lifecycle hooks for Document Service
 * Migration Guide: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service
 * Document Service API: https://docs.strapi.io/cms/api/document-service
 */

"use strict";

const validator = require("../../../../helpers/validator.js");

module.exports = {
  async beforeCreate(event) {
    let { data } = event.params;
    validator.facilityTypeValidator(data.facilityType);
    validator.protectedAreaOrSiteValidator(data.protectedArea, data.site);
  },
  async beforeUpdate(event) {
    let { data } = event.params;
    validator.facilityTypeValidator(data.facilityType);
    validator.protectedAreaOrSiteValidator(data.protectedArea, data.site);
  },
};
