import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { role, isAuthenticated, loading } = useAuth();

  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  
  if (!allowedRoles.includes(role)) {
    console.warn(`Access denied: role "${role}" is not allowed.`);
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleBasedRoute;
