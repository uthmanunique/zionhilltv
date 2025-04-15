import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from '../api';

const AdminProtectedRoute = ({ element: Component }) => {
  const { token } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setIsAdmin(data.role === 'admin');
        } catch (err) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [token]);

  if (isAdmin === null) return <div>Loading...</div>;
  return isAdmin ? <Component /> : <Navigate to="/signin" />;
};

export default AdminProtectedRoute;