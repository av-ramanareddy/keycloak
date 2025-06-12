export interface KeycloakUser {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: KeycloakUser | null;
  token: string | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}