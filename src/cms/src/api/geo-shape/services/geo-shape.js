'use strict';

/**
 * geo-shape service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::geo-shape.geo-shape');
