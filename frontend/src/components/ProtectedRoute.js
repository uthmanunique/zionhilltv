// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element: Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Element /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;