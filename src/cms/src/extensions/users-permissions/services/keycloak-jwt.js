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
    let token = ctx.request.header.authorization;
    let tokenString = "";

    if (token && token.indexOf("Bearer ") == 0) {
      tokenString = token.split(" ")[1];

      const client = jwksClient({
        structSsl: true,
        jwksUri: SSO_JWKSURI,
      });

      const decoded = jwt.decode(tokenString, { complete: true });

      if (!decoded) {
        return;
      }

      const kid = decoded.header.kid;

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
});
