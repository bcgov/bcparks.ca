import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_AUTH_URL,
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
