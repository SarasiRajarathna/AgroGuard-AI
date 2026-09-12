import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('agroguard_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Restore & verify session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('agroguard_token');
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('agroguard_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('[AuthContext] Stored session invalid or expired:', err.message);
          localStorage.removeItem('agroguard_token');
          localStorage.removeItem('agroguard_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email, password, demoRole) => {
    try {
      const res = await authAPI.login(email, password);
      if (res.success && res.token) {
        localStorage.setItem('agroguard_token', res.token);
        localStorage.setItem('agroguard_user', JSON.stringify(res.user));
        setUser(res.user);
        return res.user;
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('agroguard_token');
      localStorage.removeItem('agroguard_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
