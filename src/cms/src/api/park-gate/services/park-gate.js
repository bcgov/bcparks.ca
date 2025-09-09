'use strict';

/**
 * park-gate service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::park-gate.park-gate');
