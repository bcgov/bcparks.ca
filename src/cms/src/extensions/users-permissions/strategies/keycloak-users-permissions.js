'use strict';

const { map } = require('lodash/fp');
const { UnauthorizedError } = require('@strapi/utils').errors;
const AUTH_URL =
  process.env.STRAPI_SSO_AUTH_URL || "https://dev.loginproxy.gov.bc.ca/auth";

const KEYCLOAK_AUTH_ROLES = ["submitter", "approver"];

const getService = (name) => {
  return strapi.plugin("users-permissions").service(name);
};

const authenticate = async (ctx) => {
  try {
    const kcToken = await getService('keycloakJwt').getKCToken(ctx);

    if (!kcToken) {
      // No Keycloak token, return unauthenticated to let other strategies handle it
      return { authenticated: false };
    }

    const { iss: issuer } = kcToken;

    if (!issuer || !issuer.toLowerCase().startsWith(AUTH_URL.toLowerCase())) {
      // Not a Keycloak token, return unauthenticated
      return { authenticated: false };
    }

    strapi.log.info(`Authenticating ${kcToken.email} with Keycloak`);

    if (ctx.state.user) {
      strapi.log.info("Already authenticated");
      return { authenticated: true };
    }

    const roles = kcToken.resource_access?.['staff-portal']?.roles;

    if (!roles) {
      strapi.log.warn("No staff-portal roles found");
      return { error: "Invalid credentials" };
    }

    const hasRequiredRole = roles.some((role) =>
      KEYCLOAK_AUTH_ROLES.includes(role),
    );

    if (!hasRequiredRole) {
      strapi.log.warn("Missing required staff-portal role");
      return { error: "Invalid credentials: staff-portal role not assigned" };
    }

    const users = await getService("user").fetchAll({
      filters: { username: { $eq: "apiuser" } },
      populate: { role: "*" },
    });

    const user = users.length ? users[0] : null;

    if (!user) {
      strapi.log.error("API user 'apiuser' not found");
      return { error: "API user account does not exist" };
    }

    if (user.blocked) {
      strapi.log.warn("Invalid credentials: user blocked");
      return { error: "Invalid credentials: user blocked" };
    }

    // Fetch user's permissions
    const permissions = await Promise.resolve(user.role.id)
      .then((roleId) => getService("permission").findRolePermissions(roleId))
      .then(
        map((perm) => getService("permission").toContentAPIPermission(perm)),
      );

    // Generate an ability (content API engine) based on the given permissions
    const ability = await strapi.contentAPI.permissions.engine.generateAbility(permissions);

    ctx.state.user = user;

    return {
      authenticated: true,
      credentials: user,
      ability,
    };
  } catch (err) {
    strapi.log.error("keycloak-users-permissions.js error: " + err);
    return { authenticated: false };
  }
};

const verify = async (auth, config) => {
  // Basic JWT verification - just return the auth object
  return auth;
};

module.exports = {
  name: 'users-permissions',
  authenticate,
  verify,
};
