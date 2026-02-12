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
    const { data } = event.params;
    validator.protectedAreaValidator(data.protectedArea);
    validator.slugCharacterValidator(data.slug);
    validator.slugNoLeadingSlashValidator(data.slug);
    validator.slugNoLeadingDashValidator(data.slug);
    validator.slugNoTrailingDashValidator(data.slug);
  },
  async beforeUpdate(event) {
    if (disabled) return;
    const { data } = event.params;
    validator.protectedAreaValidator(data.protectedArea);
    validator.slugCharacterValidator(data.slug);
    validator.slugNoLeadingSlashValidator(data.slug);
    validator.slugNoLeadingDashValidator(data.slug);
    validator.slugNoTrailingDashValidator(data.slug);
  },
};
