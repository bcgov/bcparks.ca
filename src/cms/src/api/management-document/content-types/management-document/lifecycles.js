"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const validator = require("../../../../helpers/validator.js");

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    validator.documentTypeValidator(data.documentType);
  },
  beforeUpdate(event) {
    const { data } = event.params;
    validator.documentTypeValidator(data.documentType);
  },
};
