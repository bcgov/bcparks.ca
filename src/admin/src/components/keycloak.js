import Keycloak from "keycloak-js";
import config from "../utils/config";

const keycloakConfig = {
  url: config.REACT_APP_KEYCLOAK_AUTH_URL,
  realm: config.REACT_APP_KEYCLOAK_REALM,
  clientId: config.REACT_APP_KEYCLOAK_CLIENT_ID,
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
