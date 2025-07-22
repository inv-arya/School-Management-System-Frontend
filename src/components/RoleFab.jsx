import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import withRoleAccess from '../hoc/withRoleAccess';

const RoleFab = ({ onClick }) => (
  <Fab
    color="primary"
    aria-label="add"
    onClick={onClick}
    sx={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      zIndex: 1000,
    }}
  >
    <AddIcon />
  </Fab>
);

const withRoleFab = (allowedRoles) => withRoleAccess(RoleFab, allowedRoles);

export default withRoleFab;
