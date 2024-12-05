const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

module.exports = {
  // saving without a protectedArea relation is not allowed
  protectedAreaConnectValidator: function (protectedArea) {
    if (protectedArea?.connect?.length === 0) {
      throw new ApplicationError('Please add protectedArea relation.');
    }
  },
  // removing a protectedArea relation is not allowed
  protectedAreaDisconnectValidator: function (protectedArea) {
    if (protectedArea?.disconnect?.length > 0 && protectedArea?.connect?.length === 0) {
      throw new ApplicationError('Please add protectedArea relation.');
    }
  },
  // saving without an activityType relation is not allowed
  activityTypeConnectValidator: function (activityType) {
    if (activityType?.connect?.length === 0) {
      throw new ApplicationError('Please add activityType relation.');
    }
  },
  // removing an activityType relation is not allowed
  activityTypeDisconnectValidator: function (activityType) {
    if (activityType?.disconnect?.length > 0 && activityType?.connect?.length === 0) {
      throw new ApplicationError('Please add activityType relation.');
    }
  },
  // saving without a facilityType relation is not allowed
  facilityTypeConnectValidator: function (facilityType) {
    if (facilityType?.connect?.length === 0) {
      throw new ApplicationError('Please add facilityType relation.');
    }
  },
  // removing a facilityType relation is not allowed
  facilityTypeDisconnectValidator: function (facilityType) {
    if (facilityType?.disconnect?.length > 0 && facilityType?.connect?.length === 0) {
      throw new ApplicationError('Please add facilityType relation.');
    }
  },
  // saving without a campingType relation is not allowed
  campingTypeConnectValidator: function (campingType) {
    if (campingType?.connect?.length === 0) {
      throw new ApplicationError('Please add campingType relation.');
    }
  },
  // removing a campingType relation is not allowed
  campingTypeDisconnectValidator: function (campingType) {
    if (campingType?.disconnect?.length > 0 && campingType?.connect?.length === 0) {
      throw new ApplicationError('Please add campingType relation.');
    }
  },
  // saving without a documentType relation is not allowed
  documentTypeConnectValidator: function (documentType) {
    if (documentType?.connect?.length === 0) {
      throw new ApplicationError('Please add documentType relation.');
    }
  },
  // removing a documentType relation is not allowed
  documentTypeDisconnectValidator: function (documentType) {
    if (documentType?.disconnect?.length > 0 && documentType?.connect?.length === 0) {
      throw new ApplicationError('Please add documentType relation.');
    }
  },
  // checks for valid characters and consecutive forward slashes
  slugCharacterValidator: function (slug) {
    const regex = new RegExp("^[a-z0-9\-\/]+(?:-[a-z0-9\-\/]+)*$|^$");
    if (!regex.test(slug)) {
      throw new ApplicationError('Please enter lower case letters, numbers, hyphens, or slashes for slugs. No spaces.');
    }
    const regex2 = new RegExp("^(?!.*\/\/)[a-z0-9\-\/]+(?:-[a-z0-9\-\/]+)*$|^$");
    if (!regex2.test(slug)) {
      throw new ApplicationError('Consecutive forward slashes are not allowed in slugs.');
    }
  },
  // a leading slash is required
  slugLeadingSlashValidator: function (slug) {
    if (slug && slug.slice(0, 1) !== '/') {
      throw new ApplicationError('Please add slash to the beginning of slugs.');
    }
  },
  // a leading slash is not allowed
  slugNoLeadingSlashValidator: function (slug) {
    if (slug && slug.slice(0, 1) === '/') {
      throw new ApplicationError('Do not add slash to the beginning of slugs.');
    }
  },
  // a leading dash is not allowed
  slugNoLeadingDashValidator: function (slug) {
    if (slug && slug.slice(0, 1) === '-') {
      throw new ApplicationError('Do not add dash to the beginning of slugs.');
    }
    if (slug && slug.includes('/-')) {
      throw new ApplicationError('Do not add dash after a slash.');
    }
  },
  // a trailing slash is required
  slugTrailingSlashValidator: function (slug) {
    if (slug && slug.slice(-1) !== '/') {
      throw new ApplicationError('Please add slash to the end of slugs.');
    }
  },
  // a trailing slash is not allowed
  slugNoTrailingSlashValidator: function (slug) {
    if (slug && slug.slice(-1) === '/') {
      throw new ApplicationError('Do not add slash to the end of slugs.');
    }
  },
  // a trailing dash is not allowed
  slugNoTrailingDashValidator: function (slug) {
    if (slug && slug.slice(-1) === '-') {
      throw new ApplicationError('Do not add dash to the end of slugs.');
    }
    if (slug && slug.includes('-/')) {
      throw new ApplicationError('Do not add dash before a slash.');
    }
  },
  // foward slashes are not allowed in the slug
  slugNoSlashValidator: function (slug) {
    if (slug && slug.includes('/')) {
      throw new ApplicationError('Do not add slash in slugs.');
    }
  },
}
