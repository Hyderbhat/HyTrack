import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setApiToken } from '../utils/api.js';

const STORAGE_KEY = 'hytrack.auth.token';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setApiToken(token);

    if (!token) {
      setUser(null);
      setLoading(false);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(STORAGE_KEY, token);

    let cancelled = false;
    const bootstrap = async () => {
      setLoading(true);
      try {
        const response = await api.get('/auth/me');
        if (!cancelled) setUser(response.user);
      } catch {
        if (!cancelled) {
          setUser(null);
          setToken('');
          localStorage.removeItem(STORAGE_KEY);
          setApiToken(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    bootstrap();
    return () => { cancelled = true; };
  }, [token]);

  const applySession = (session) => {
    setToken(session.token);
    setUser(session.user);
  };

  const signup = async (payload) => {
    const session = await api.post('/auth/signup', payload);
    applySession(session);
    return session.user;
  };

  const login = async (payload) => {
    const session = await api.post('/auth/login', payload);
    applySession(session);
    return session.user;
  };

  const updateProfile = async (payload) => {
    const response = await api.patch('/auth/me', payload);
    setUser(response.user);
    return response.user;
  };

  const changePassword = async (payload) => api.post('/auth/change-password', payload);

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // Clear local session even if remote session is already gone.
    } finally {
      setUser(null);
      setToken('');
      setApiToken(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    signup,
    login,
    updateProfile,
    changePassword,
    logout,
  }), [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
