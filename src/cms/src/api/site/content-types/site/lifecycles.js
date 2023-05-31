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
