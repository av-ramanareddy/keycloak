import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'sample-realm',
  clientId: 'sample-app',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;