"use strict";

/**
 * Jwt.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const AUTH_URL = process.env.STRAPI_SSO_AUTH_URL || "https://dev.loginproxy.gov.bc.ca/auth";
const REALM = process.env.STRAPI_SSO_REALM || "bcparks-service-transformation";
const SSO_ISSUER = AUTH_URL + "/realms/" + REALM;
const SSO_JWKSURI = SSO_ISSUER + "/protocol/openid-connect/certs";

module.exports = ({ strapi }) => ({
  getKCToken(ctx) {
    const authHeader = ctx.request.header.authorization;

    if (!authHeader || authHeader.indexOf("Bearer ") !== 0) {
      return null;
    }

    const tokenString = authHeader.split(" ")[1];

    // Skip non-JWT tokens (e.g., Strapi API tokens without dots)
    if (!tokenString.includes(".")) {
      return null;
    }

    const jwksClientConfig = {
      jwksUri: SSO_JWKSURI,
      cache: true,
      cacheMaxEntries: 10,
      cacheMaxAge: 60 * 60 * 1000,
    };

    const client = jwksClient(jwksClientConfig);
    const decoded = jwt.decode(tokenString, { complete: true });

    if (!decoded || !decoded.header || !decoded.header.kid) {
      return null;
    }

    const keyId = decoded.header.kid;

    return new Promise((resolve, reject) => {
      client.getSigningKey(keyId, (err, key) => {
        if (err) {
          strapi.log.error("Error fetching signing key:", err);
          return reject(err);
        }
        const publicKey = key.publicKey || key.rsaPublicKey;
        resolve(this.keycloakVerify(tokenString, publicKey));
      });
    });
  },

  keycloakVerify(token, publicKey) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, publicKey, { issuer: SSO_ISSUER }, (err, payload) => {
        if (err) {
          strapi.log.error("Token verification failed:", err);
          return reject(new Error("Invalid token"));
        }
        resolve(payload || {});
      });
    });
  },
});
