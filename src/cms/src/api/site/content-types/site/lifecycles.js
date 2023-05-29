"use strict";
const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const validator = require("../../../../helpers/slugValidator.js");

module.exports = {
  async beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    if (data.protectedArea.connect.length === 0) {
      throw new ApplicationError('Please add protectedArea relation.');
    }
    validator.slugCharacterValidator(data.slug)
    validator.slugNoLeadingSlashValidator(data.slug)
    validator.slugNoLeadingDashValidator(data.slug)
    validator.slugNoTrailingDashValidator(data.slug)
  },
  async beforeUpdate(event) {
    const { data, where, select, populate } = event.params;
    if (data.protectedArea.disconnect.length > 0) {
      throw new ApplicationError('Please add protectedArea relation.');
    }
    validator.slugCharacterValidator(data.slug)
    validator.slugNoLeadingSlashValidator(data.slug)
    validator.slugNoLeadingDashValidator(data.slug)
    validator.slugNoTrailingDashValidator(data.slug)
  }
};
