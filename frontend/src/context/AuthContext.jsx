import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('codex_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('codex_token');
      const storedUser = localStorage.getItem('codex_user');
      
      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error('Failed to parse user cache', e);
          }
        }
        try {
          const profile = await profileAPI.getProfile();
          setUser(profile);
          localStorage.setItem('codex_user', JSON.stringify(profile));
        } catch (err) {
          console.warn('Could not refresh profile from server, using cached user', err);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setError(null);
    try {
      const data = await authAPI.login(credentials);
      const userObj = data.user || { email: credentials.email, name: credentials.email.split('@')[0] };
      const tokenStr = data.token || 'mock_jwt_' + Date.now();
      
      setToken(tokenStr);
      setUser(userObj);
      localStorage.setItem('codex_token', tokenStr);
      localStorage.setItem('codex_user', JSON.stringify(userObj));
      return { success: true, user: userObj };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const data = await authAPI.register(userData);
      const userObj = data.user || userData;
      const tokenStr = data.token || 'mock_jwt_' + Date.now();
      
      setToken(tokenStr);
      setUser(userObj);
      localStorage.setItem('codex_token', tokenStr);
      localStorage.setItem('codex_user', JSON.stringify(userObj));
      return { success: true, user: userObj };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const updateUser = async (profileData) => {
    try {
      const updated = await profileAPI.updateProfile(profileData);
      setUser(updated);
      localStorage.setItem('codex_user', JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error('Failed to update profile', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('codex_token');
    localStorage.removeItem('codex_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        error,
        setError,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
