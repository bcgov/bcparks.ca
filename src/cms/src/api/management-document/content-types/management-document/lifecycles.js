"use strict";

/**
 * Strapi 5 lifecycle hooks for Document Service
 * Migration Guide: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service
 * Document Service API: https://docs.strapi.io/cms/api/document-service
 */

const validator = require("../../../../helpers/validator.js");

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    validator.documentTypeValidator(data.documentType);
  },
  async beforeUpdate(event) {
    const { data } = event.params;
    validator.documentTypeValidator(data.documentType);
  },
};
