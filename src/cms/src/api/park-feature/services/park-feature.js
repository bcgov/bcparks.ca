'use strict';

/**
 * park-feature service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::park-feature.park-feature');
