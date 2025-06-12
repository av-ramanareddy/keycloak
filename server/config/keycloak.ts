import session from 'express-session';
import Keycloak from 'keycloak-connect';

// Keycloak configuration
const keycloakConfig = {
  realm: process.env.KEYCLOAK_REALM || 'taskflow',
  'auth-server-url': process.env.KEYCLOAK_URL || 'http://localhost:8080',
  'ssl-required': 'external',
  resource: process.env.KEYCLOAK_CLIENT_ID || 'taskflow-client',
  'public-client': true,
  'confidential-port': 0,
  'bearer-only': false,
  'enable-cors': true
};

// Session store configuration
const memoryStore = new session.MemoryStore();

export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'taskflow-secret-key-change-in-production',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Initialize Keycloak
export const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

export { keycloakConfig };