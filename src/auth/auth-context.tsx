import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiRequest, tryRefresh } from '@/api/client';
import { getAccessToken, onAccessTokenChange, setAccessToken } from '@/api/token-store';

interface AuthState {
  authenticated: boolean;
  /** True until the initial cookie-based refresh attempt resolves. */
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(getAccessToken() !== null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On first load, try to re-establish a session from the refresh cookie.
    tryRefresh().finally(() => setLoading(false));
    return onAccessTokenChange((token) => setAuthenticated(token !== null));
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      authenticated,
      loading,
      logout: async () => {
        try {
          await apiRequest('/auth/logout', { method: 'POST' });
        } finally {
          setAccessToken(null);
        }
      },
    }),
    [authenticated, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
