import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://54.81.131.235:8080',
  realm: 'sample-realm',
  clientId: 'sample-app',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
