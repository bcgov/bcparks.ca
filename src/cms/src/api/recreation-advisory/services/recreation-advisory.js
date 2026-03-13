'use strict';

/**
 * recreation-advisory service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::recreation-advisory.recreation-advisory');
