"use strict";

/*
 * Vendored from @strapi/plugin-users-permissions v5.62.0
 * packages/plugins/users-permissions/server/src/strategies/users-permissions.js
 *
 * Copyright (c) 2015-present Strapi Solutions SAS. MIT Expat License.
 *
 * This is the built-in users-permissions verify(), which checks the role's
 * permissions against the route scope. Vendored because the Strapi 5 package
 * "exports" field blocks requiring it from the plugin directly.
 *
 * Copied unchanged apart from formatting. Compare against the plugin source
 * when upgrading Strapi.
 */

const { every } = require("lodash");
const { ForbiddenError, UnauthorizedError } = require("@strapi/utils").errors;

const verify = async (auth, config) => {
  const { credentials: user, ability } = auth;

  if (!config.scope) {
    if (!user) {
      // A non authenticated user cannot access routes that do not have a scope
      throw new UnauthorizedError();
    } else {
      // An authenticated user can access non scoped routes
      return;
    }
  }

  // If no ability have been generated, then consider auth is missing
  if (!ability) {
    throw new UnauthorizedError();
  }

  const scopes = Array.isArray(config.scope) ? config.scope : [config.scope];

  const isAllowed = every(scopes, (scope) => ability.can(scope));

  if (!isAllowed) {
    throw new ForbiddenError();
  }
};

module.exports = verify;
