
/*
 * ============================================================
 * STRAPI 5 LIFECYCLE HOOKS - MIGRATED TO DOCUMENT SERVICE
 * ============================================================
 *
 * NOTE: This lifecycle logic has been migrated to Document Service Middleware
 * in src/index.js as recommended by Strapi v5 migration guide.
 *
 * This file is kept for reference but the main logic now runs through the
 * centralized middleware to properly handle Draft & Publish and i18n features.
 *
 * Migration Guide: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service
 * Document Service Middlewares: https://docs.strapi.io/cms/api/document-service/middlewares
 *
 * ============================================================
 */

"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const validator = require("../../../../helpers/validator.js");

module.exports = {
    beforeCreate(event) {
        const { data, where, select, populate } = event.params;
        validator.protectedAreaConnectValidator(data.protectedArea)
        validator.slugCharacterValidator(data.slug)
        validator.slugNoLeadingSlashValidator(data.slug)
        validator.slugNoLeadingDashValidator(data.slug)
        validator.slugNoTrailingDashValidator(data.slug)
    },
    beforeUpdate(event) {
        const { data, where, select, populate } = event.params;
        validator.protectedAreaDisconnectValidator(data.protectedArea)
        validator.slugCharacterValidator(data.slug)
        validator.slugNoLeadingSlashValidator(data.slug)
        validator.slugNoLeadingDashValidator(data.slug)
        validator.slugNoTrailingDashValidator(data.slug)
    }
};
