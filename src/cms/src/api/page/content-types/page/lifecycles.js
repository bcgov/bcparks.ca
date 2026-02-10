"use strict";

/**
 * Strapi 5 lifecycle hooks for Document Service
 * Migration Guide: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service
 * Document Service API: https://docs.strapi.io/cms/api/document-service
 */

const validator = require("../../../../helpers/validator.js");
const disabled = process.env.DISABLE_LIFECYCLES === "true";

module.exports = {
  async beforeCreate(event) {
    if (disabled) return;
    const { data } = event.params;
    validator.slugCharacterValidator(data.Slug);
    validator.slugLeadingSlashValidator(data.Slug);
    validator.slugNoLeadingDashValidator(data.Slug);
    validator.slugNoTrailingDashValidator(data.Slug);
  },
  async beforeUpdate(event) {
    if (disabled) return;
    const { data } = event.params;
    validator.slugCharacterValidator(data.Slug);
    validator.slugLeadingSlashValidator(data.Slug);
    validator.slugNoLeadingDashValidator(data.Slug);
    validator.slugNoTrailingDashValidator(data.Slug);
  },
};
