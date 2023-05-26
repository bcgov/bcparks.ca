"use strict";
const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const validator = require("../../../../helpers/slugValidator.js");
const hasProtectedArea = async (where) => {
  if (where) {
    try {
      const site = await strapi.entityService.findOne(
        "api::site.site", where.id, { populate: '*' }
      )
      const protectedArea = site.protectedArea
      if (protectedArea === null) {
        throw new ApplicationError('Please add protectedArea relation.');
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  async beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    hasProtectedArea(where)
    validator.slugCharacterValidator(data.slug)
    validator.slugNoLeadingSlashValidator(data.slug)
    validator.slugNoLeadingDashValidator(data.slug)
    validator.slugNoTrailingDashValidator(data.slug)
  },
  async beforeUpdate(event) {
    const { data, where, select, populate } = event.params;
    hasProtectedArea(where)
    validator.slugCharacterValidator(data.slug)
    validator.slugNoLeadingSlashValidator(data.slug)
    validator.slugNoLeadingDashValidator(data.slug)
    validator.slugNoTrailingDashValidator(data.slug)
  }
};
