/**
 * LoginPage Component
 * Page wrapper for the Login component
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Login } from '../components/Auth';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { isAuthenticated, loading } = useAuth();

  // Redirect to dashboard if already authenticated
  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
};

export default LoginPage;
