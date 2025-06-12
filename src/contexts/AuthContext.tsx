import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Keycloak from 'keycloak-js';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  keycloak: Keycloak | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        // Fetch Keycloak configuration from backend
        const configResponse = await fetch('/api/keycloak-config');
        const config = await configResponse.json();

        const keycloakInstance = new Keycloak({
          url: config.url,
          realm: config.realm,
          clientId: config.clientId,
        });

        const authenticated = await keycloakInstance.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        });

        setKeycloak(keycloakInstance);

        if (authenticated && keycloakInstance.token) {
          setToken(keycloakInstance.token);
          
          // Extract user info from token
          const tokenParsed = keycloakInstance.tokenParsed;
          if (tokenParsed) {
            setUser({
              id: tokenParsed.sub || '',
              email: tokenParsed.email || '',
              name: tokenParsed.name || tokenParsed.preferred_username || '',
              username: tokenParsed.preferred_username || '',
            });
          }
        }

        // Set up token refresh
        keycloakInstance.onTokenExpired = () => {
          keycloakInstance.updateToken(30).then((refreshed) => {
            if (refreshed) {
              setToken(keycloakInstance.token);
            }
          }).catch(() => {
            console.error('Failed to refresh token');
            logout();
          });
        };

      } catch (error) {
        console.error('Failed to initialize Keycloak:', error);
      } finally {
        setLoading(false);
      }
    };

    initKeycloak();
  }, []);

  const login = () => {
    if (keycloak) {
      keycloak.login();
    }
  };

  const logout = () => {
    if (keycloak) {
      setUser(null);
      setToken(null);
      keycloak.logout();
    }
  };

  const value: AuthContextType = {
    user,
    keycloak,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};