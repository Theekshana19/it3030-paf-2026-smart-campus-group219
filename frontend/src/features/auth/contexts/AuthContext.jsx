import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { loginWithGoogle, loginManual, registerManual, getMe } from '../api/authApi';
import {
  clearAuth,
  getToken,
  saveToken,
  saveUser,
} from '../utils/tokenStorage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: validate any stored token and re-hydrate user state
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((data) => setUser(data))
      .catch(() => {
        clearAuth();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const _saveSession = useCallback((data) => {
    saveToken(data.token);
    saveUser(data);
    setUser(data);
    return data;
  }, []);

  const login = useCallback(async (googleCredential) => {
    return _saveSession(await loginWithGoogle(googleCredential));
  }, [_saveSession]);

  const loginWithCredentials = useCallback(async ({ email, password }) => {
    return _saveSession(await loginManual({ email, password }));
  }, [_saveSession]);

  const register = useCallback(async ({ displayName, email, password }) => {
    return _saveSession(await registerManual({ displayName, email, password }));
  }, [_saveSession]);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, loginWithCredentials, register, logout }),
    [user, loading, login, loginWithCredentials, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
