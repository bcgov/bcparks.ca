import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: "http://localhost:8080/auth",
  realm: "g7v0xlf4",
  clientId: "account",
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
