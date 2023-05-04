const REACT_APP_API_BASE_URL =
  window.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5000";

const REACT_APP_CMS_BASE_URL =
  window.REACT_APP_CMS_BASE_URL ||
  process.env.REACT_APP_CMS_BASE_URL ||
  "http://localhost:1337";

const REACT_APP_FRONTEND_BASE_URL =
  window.REACT_APP_FRONTEND_BASE_URL ||
  process.env.REACT_APP_FRONTEND_BASE_URL ||
  "http://localhost:3000";

const REACT_APP_KEYCLOAK_AUTH_URL =
  window.REACT_APP_KEYCLOAK_AUTH_URL ||
  process.env.REACT_APP_KEYCLOAK_AUTH_URL ||
  "http://localhost:8080/auth";

const REACT_APP_KEYCLOAK_REALM =
  window.REACT_APP_KEYCLOAK_REALM ||
  process.env.REACT_APP_KEYCLOAK_REALM ||
  "myrealm";

const REACT_APP_KEYCLOAK_CLIENT_ID =
  window.REACT_APP_KEYCLOAK_CLIENT_ID ||
  process.env.REACT_APP_KEYCLOAK_CLIENT_ID ||
  "account";

const REACT_APP_STAT_HOLIDAY_API =
  window.REACT_APP_STAT_HOLIDAY_API ||
  process.env.REACT_APP_STAT_HOLIDAY_API ||
  "https://canada-holidays.ca/api/v1/provinces/BC";

const REACT_APP_PUBLIC_URL =
  window.REACT_APP_PUBLIC_URL ||
  process.env.REACT_APP_PUBLIC_URL ||
  "http://localhost:8000";

const config = {
  REACT_APP_API_BASE_URL,
  REACT_APP_CMS_BASE_URL,
  REACT_APP_FRONTEND_BASE_URL,
  REACT_APP_KEYCLOAK_AUTH_URL,
  REACT_APP_KEYCLOAK_REALM,
  REACT_APP_KEYCLOAK_CLIENT_ID,
  REACT_APP_STAT_HOLIDAY_API,
  REACT_APP_PUBLIC_URL
};

export default config;
