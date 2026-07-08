const axios = require("axios");
const { ClientCredentials } = require("simple-oauth2");
const dotenv = require("dotenv");

dotenv.config({
  path: `.env`,
});

// In-memory token state shared by all requests in this process.
let cachedAccessToken = null;
let inFlightTokenRequest = null;

// Fail fast on startup if required RecSpace settings are missing.
const missingRecSpaceConfig = [
  "REC_SPACE_BASE_URL",
  "REC_SPACE_KEYCLOAK_TOKEN_URL",
  "REC_SPACE_KEYCLOAK_CLIENT_ID",
  "REC_SPACE_KEYCLOAK_CLIENT_SECRET",
].filter((name) => !process.env[name]);

if (missingRecSpaceConfig.length > 0) {
  throw new Error(
    `Missing RecSpace config: ${missingRecSpaceConfig.join(", ")}`,
  );
}

const tokenUrl = new URL(process.env.REC_SPACE_KEYCLOAK_TOKEN_URL);
const oauthClient = new ClientCredentials({
  client: {
    id: process.env.REC_SPACE_KEYCLOAK_CLIENT_ID,
    secret: process.env.REC_SPACE_KEYCLOAK_CLIENT_SECRET,
  },
  auth: {
    tokenHost: `${tokenUrl.protocol}//${tokenUrl.host}`,
    tokenPath: `${tokenUrl.pathname}${tokenUrl.search}`,
  },
});

async function fetchRecSpaceAccessToken() {
  // Reuse the cached token until it is within 5 seconds of expiry.
  if (cachedAccessToken && !cachedAccessToken.expired(5)) {
    return cachedAccessToken.token.access_token;
  }

  // If another request is already refreshing, wait for that same promise.
  if (inFlightTokenRequest) {
    return inFlightTokenRequest;
  }

  inFlightTokenRequest = oauthClient
    .getToken({})
    .then((accessToken) => {
      if (!accessToken?.token?.access_token) {
        throw new Error("Keycloak token response missing access_token");
      }

      cachedAccessToken = accessToken;
      return accessToken.token.access_token;
    })
    .finally(() => {
      // Always clear the in-flight marker so future refreshes can run.
      inFlightTokenRequest = null;
    });

  return inFlightTokenRequest;
}

const recSpaceAxios = axios.create({
  baseURL: process.env.REC_SPACE_BASE_URL,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
  rejectUnauthorized: false,
});

recSpaceAxios.interceptors.request.use(async (config) => {
  // Attach a valid bearer token (cached or refreshed) to each request.
  const token = await fetchRecSpaceAccessToken();

  config.headers ??= {};
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

module.exports = {
  recSpaceAxios,
};
