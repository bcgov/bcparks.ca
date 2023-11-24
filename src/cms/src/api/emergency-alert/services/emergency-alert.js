'use strict';

/**
 * emergency-alert service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::emergency-alert.emergency-alert');
