'use strict';

const { map } = require('lodash/fp');
const { UnauthorizedError } = require('@strapi/utils').errors;
const { getService } = require('../../../../node_modules/@strapi/plugin-users-permissions/server/utils');
const {
  authenticate: baseAuthenticate,
  verify: baseVerify
} = require('../../../../node_modules/@strapi/plugin-users-permissions/server/strategies/users-permissions');

const AUTH_URL =
  process.env.STRAPI_SSO_AUTH_URL || "https://dev.loginproxy.gov.bc.ca/auth";

const KEYCLOAK_AUTH_ROLES = ["submitter", "approver"];

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
          strapi.log.info("Already authenticated in a different way");
          return { authenticated: true };
        }

        try {
          // fetch authenticated user using keycloak creds
          if (kcToken.resource_access?.['staff-portal']?.roles) {
            const roles = kcToken.resource_access['staff-portal'].roles;
            const roleMatch = roles.some((e) =>
              KEYCLOAK_AUTH_ROLES.includes(e)
            );

            if (roleMatch) {
              const users = await getService('user').fetchAll({ filters: { username: { $eq: 'apiuser' } }, populate: { role: "*" } });
              user = users.length ? users[0] : null;
              if (user === null) {
                strapi.log.error(`A user with usrname 'apiuser' was not found in the User collection-type`);
                return { error: "API user account does not exist" };
              }
            } else {
              strapi.log.warn("Invalid credentials: staff-portal role not assigned");
              return { error: "Invalid credentials: staff-portal role not assigned" };
            }
          } else {
            strapi.log.warn("Invalid credentials");
            return { error: "Invalid credentials" };
          }
        } catch (err) {
          strapi.log.error("UnautorizedError:" + err);
          throw new UnauthorizedError(err);
        }

        if (user.blocked) {
          strapi.log.warn("Invalid credentials: user blocked");
          return { error: "Invalid credentials: user blocked" };
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
    strapi.log.error("keycloak-users-permissions.js error: " + err);
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
