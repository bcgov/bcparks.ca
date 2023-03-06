'use strict';

const { map } = require('lodash/fp');
const { UnauthorizedError } = require('@strapi/utils').errors;
const { getService } = require('@strapi/plugin-users-permissions/server/utils');
const {
  authenticate: baseAuthenticate,
  verify: baseVerify
} = require('@strapi/plugin-users-permissions/server/strategies/users-permissions');

const AUTH_URL =
  process.env.STRAPI_SSO_AUTH_URL || "https://dev.loginproxy.gov.bc.ca/auth";

const KEYCLOAK_AUTH_ROLES = ["submitter", "approver"];
const API_USER_EMAIL = process.env.STRAPI_API_USER_EMAIL;

const authenticate = async (ctx) => {

  try {

    const kcToken = await getService('keycloakJwt').getKCToken(ctx);

    if (kcToken) {

      const { iss: issuer } = kcToken;

      if (issuer.toLowerCase().startsWith(AUTH_URL.toLowerCase())) {

        strapi.log.info(`Authenticating ${kcToken.email} with Keycloak`);

        let user;

        if (ctx.state.user) {
          // request is already authenticated in a different way
          return { authenticated: true };
        }

        try {
          // fetch authenticated user using keycloak creds
          if (kcToken.resource_access?.['staff-portal']?.roles) {
            const roles = kcToken.resource_access['staff-portal'].roles;
            const roleMatch = roles.some((e) =>
              KEYCLOAK_AUTH_ROLES.includes(e)
            );

            if (!API_USER_EMAIL) {
              throw new Error("API_USER_EMAIL value not set");
            }

            if (roleMatch) {
              const users = await getService('user').fetchAll({ filters: { email: API_USER_EMAIL }, populate: { role: "*" } });
              user = users.length ? users[0] : null;
            } else {
              return { error: 'Invalid credentials: staff-portal role not assigned' };
            }
          } else {
            return { error: 'Invalid credentials' };
          }
        } catch (err) {
          throw new UnauthorizedError(err);
        }

        if (user.blocked) {
          return { error: 'Invalid credentials: user blocked' };
        }

        // Fetch user's permissions
        const permissions = await Promise.resolve(user.role.id)
          .then(getService('permission').findRolePermissions)
          .then(map(getService('permission').toContentAPIPermission));

        // Generate an ability (content API engine) based on the given permissions
        const ability = await strapi.contentAPI.permissions.engine.generateAbility(permissions);

        ctx.state.user = user;

        return {
          authenticated: true,
          credentials: user,
          ability,
        };
      }
    } else {
      return await baseAuthenticate(ctx);
    }
  } catch (err) {
    return { authenticated: false };
  }
};

const verify = async (auth, config) => {
  return await baseVerify(auth, config)
};

module.exports = {
  name: 'users-permissions',
  authenticate,
  verify,
};
