"use strict";

/**
 * Jwt.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const _ = require("lodash");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const AUTH_URL =
  process.env.STRAPI_SSO_AUTH_URL || "https://dev.loginproxy.gov.bc.ca/auth";
const REALM = process.env.STRAPI_SSO_REALM || "bcparks-service-transformation";

const SSO_ISSUER = AUTH_URL + "/realms/" + REALM;
const SSO_JWKSURI = SSO_ISSUER + "/protocol/openid-connect/certs";

module.exports = {
  getKCToken(ctx) {
    let token = ctx.request.header.authorization;
    let tokenString = "";

    if (token && token.indexOf("Bearer ") == 0) {
      tokenString = token.split(" ")[1];

      const client = jwksClient({
        structSsl: true,
        jwksUri: SSO_JWKSURI,
      });

      const kid = jwt.decode(tokenString, { complete: true }).header.kid;

      return new Promise((resolve, reject) => {
        client.getSigningKey(kid, (err, key) => {
          if (err) {
            reject("Signing Key Error:", err);
          } else {
            const signingKey = key.publicKey || key.rsaPublicKey;
            resolve(this.keycloakVerify(tokenString, signingKey));
          }
        });
      });
    }
  },

  keycloakVerify(token, signingKey) {
    return new Promise(function (resolve, reject) {
      jwt.verify(token, signingKey, {}, function (err, tokenPayload = {}) {
        if (err) {
          return reject(new Error("Invalid token."));
        }
        resolve(tokenPayload);
      });
    });
  },

  getToken(ctx) {
    const params = _.assign({}, ctx.request.body, ctx.request.query);

    let token = "";

    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const parts = ctx.request.header.authorization.split(" ");

      if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
      } else {
        throw new Error(
          "Invalid authorization header format. Format is Authorization: Bearer [token]"
        );
      }
    } else if (params.token) {
      token = params.token;
    } else {
      throw new Error("No authorization header was found");
    }

    return this.verify(token);
  },

  issue(payload, jwtOptions = {}) {
    _.defaults(jwtOptions, strapi.plugin("users-permissions").config.jwt);
    return jwt.sign(
      _.clone(payload.toJSON ? payload.toJSON() : payload),
      _.get(strapi.plugins, ["users-permissions", "config", "jwtSecret"]),
      jwtOptions
    );
  },

  verify(token) {
    return new Promise(function (resolve, reject) {
      jwt.verify(
        token,
        _.get(strapi.plugins, ["users-permissions", "config", "jwtSecret"]),
        {},
        function (err, tokenPayload = {}) {
          if (err) {
            return reject(new Error("Invalid token."));
          }
          resolve(tokenPayload);
        }
      );
    });
  },
};
