import React from 'react';
import { useAuth } from '../auth/AuthContext';

const withRoleAccess = (WrappedComponent, allowedRoles = []) => {
  return (props) => {
    const { role ,loading } = useAuth();
    if (loading) return null;
    if (!allowedRoles.includes(role)) {
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};

export default withRoleAccess;