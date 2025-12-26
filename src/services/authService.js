/**
 * Authentication service for login, register, and user management
 */
import api from './api';

const AUTH_TOKEN_KEY = 'authToken';

/**
 * Login user with username/email and password
 * @param {object} credentials - { username, password }
 * @returns {Promise<object>} Response with access_token
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  
  if (response.data.access_token) {
    localStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token);
  }
  
  return response.data;
};

/**
 * Register a new user
 * @param {object} userData - { email, username, password }
 * @returns {Promise<object>} Response with user data
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  
  // Auto-login after registration if token is returned
  if (response.data.access_token) {
    localStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token);
  }
  
  return response.data;
};

/**
 * Get the currently authenticated user
 * @returns {Promise<object>} Current user data
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Logout the current user
 */
export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Get the stored auth token
 * @returns {string|null} The auth token or null
 */
export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Check if user is authenticated (has token)
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Set the auth token
 * @param {string} token - The JWT token
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

const authService = {
  login,
  register,
  getCurrentUser,
  logout,
  getToken,
  isAuthenticated,
  setToken
};

export default authService;
