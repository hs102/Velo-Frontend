/**
 * Authentication Context Provider
 * Manages user authentication state and provides auth methods
 */
import React, { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import authService from '../services/authService';

// Create the context
export const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the app and provides auth state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(authService.getToken());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  /**
   * Fetch current user data on mount if token exists
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = authService.getToken();
      
      if (storedToken) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setToken(storedToken);
        } catch (err) {
          // Token is invalid, clear it
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Login user with credentials
   * @param {object} credentials - { username, password }
   */
  const login = useCallback(async (credentials) => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await authService.login(credentials);
      const newToken = response.access_token;
      
      // Fetch user data after successful login
      const userData = await authService.getCurrentUser();
      
      setToken(newToken);
      setUser(userData);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
      return { success: false, error: err.message || 'Login failed' };
    }
  }, []);

  /**
   * Register a new user
   * @param {object} userData - { email, username, password }
   */
  const register = useCallback(async (userData) => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await authService.register(userData);
      
      // If token is returned, auto-login
      if (response.access_token) {
        setToken(response.access_token);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
      
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
      return { success: false, error: err.message || 'Registration failed' };
    }
  }, []);

  /**
   * Logout the current user
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  /**
   * Clear any auth errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    if (token) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        // If refresh fails, log out
        logout();
      }
    }
  }, [token, logout]);

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
