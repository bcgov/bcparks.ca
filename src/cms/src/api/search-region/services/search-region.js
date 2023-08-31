'use strict';

/**
 * search-region service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::search-region.search-region');
