'use strict';

/**
 * park-gate controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::park-gate.park-gate');
