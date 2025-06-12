import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import keycloak from '../config/keycloak';
import { AuthContextType, KeycloakUser } from '../types/keycloak';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<KeycloakUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isKeycloakInitialized = useRef(false);

  useEffect(() => {
    const initKeycloak = async () => {
      // Prevent multiple initializations
      if (isKeycloakInitialized.current) {
        return;
      }
      
      isKeycloakInitialized.current = true;

      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        });

        if (authenticated) {
          setIsAuthenticated(true);
          setToken(keycloak.token || null);
          
          if (keycloak.tokenParsed) {
            const userInfo: KeycloakUser = {
              id: keycloak.tokenParsed.sub,
              username: keycloak.tokenParsed.preferred_username,
              email: keycloak.tokenParsed.email,
              firstName: keycloak.tokenParsed.given_name,
              lastName: keycloak.tokenParsed.family_name,
              fullName: keycloak.tokenParsed.name,
            };
            setUser(userInfo);
          }
        }

        // Token refresh
        keycloak.onTokenExpired = () => {
          keycloak.updateToken(30)
            .then((refreshed) => {
              if (refreshed) {
                setToken(keycloak.token || null);
              }
            })
            .catch(() => {
              setIsAuthenticated(false);
              setUser(null);
              setToken(null);
            });
        };

      } catch (error) {
        console.error('Keycloak initialization failed:', error);
        // Reset the flag on error so initialization can be retried if needed
        isKeycloakInitialized.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();
  }, []);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout();
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};