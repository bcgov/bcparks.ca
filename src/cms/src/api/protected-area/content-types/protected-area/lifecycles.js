/**
 * Lifecycle hooks for content-type specific validation and simple logic
 * Complex logic has been moved to src/middlewares/
 * see https://docs.strapi.io/dev-docs/backend-customization/models#lifecycle-hooks
 */

"use strict";

const validator = require("../../../../helpers/validator.js");
const disabled = process.env.DISABLE_LIFECYCLES === "true";

module.exports = {
  async beforeCreate(event) {
    if (disabled) return;
    const { data } = event.params;
    validator.slugCharacterValidator(data.slug);
    validator.slugNoLeadingSlashValidator(data.slug);
    validator.slugNoLeadingDashValidator(data.slug);
    validator.slugNoTrailingDashValidator(data.slug);
  },
  async beforeUpdate(event) {
    if (disabled) return;
    const { data } = event.params;
    validator.slugCharacterValidator(data.slug);
    validator.slugNoLeadingSlashValidator(data.slug);
    validator.slugNoLeadingDashValidator(data.slug);
    validator.slugNoTrailingDashValidator(data.slug);
  },
};
