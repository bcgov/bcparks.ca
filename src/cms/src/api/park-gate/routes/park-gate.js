'use strict';

/**
 * park-gate router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::park-gate.park-gate');
