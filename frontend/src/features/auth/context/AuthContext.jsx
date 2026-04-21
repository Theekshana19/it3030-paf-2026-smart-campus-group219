import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getCurrentUser } from '../api/authApi.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('authUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const googleToken = localStorage.getItem('googleToken') ?? '';
      if (!googleToken) {
        if (!cancelled) setLoadingAuth(false);
        return;
      }

      try {
        const user = await getCurrentUser();
        if (!cancelled) {
          const authUser = { ...user, googleToken };
          setCurrentUser(authUser);
          localStorage.setItem('authUser', JSON.stringify(authUser));
        }
      } catch {
        localStorage.removeItem('googleToken');
        localStorage.removeItem('authUser');
        if (!cancelled) {
          setCurrentUser(null);
        }
      } finally {
        if (!cancelled) setLoadingAuth(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback((user) => {
    const authUser = user ?? null;
    setCurrentUser(authUser);
    if (authUser?.googleToken) {
      localStorage.setItem('googleToken', authUser.googleToken);
      localStorage.setItem('authUser', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('googleToken');
      localStorage.removeItem('authUser');
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('googleToken');
    localStorage.removeItem('authUser');
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      loadingAuth,
      login,
      logout,
    }),
    [currentUser, loadingAuth, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
