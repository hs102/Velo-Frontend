/**
 * RegisterPage Component
 * Page wrapper for the Register component
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Register } from '../components/Auth';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const { isAuthenticated, loading } = useAuth();

  // Redirect to dashboard if already authenticated
  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Register />;
};

export default RegisterPage;
