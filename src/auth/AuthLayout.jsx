import { Outlet } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';

const AuthLayout = () => (
  <Container maxWidth="sm" sx={{ mt: 8 }}>
    <Typography variant="h3" align="center" mb={4}>
      School Management System
    </Typography>
    <Box sx={{ boxShadow: 3, p: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Outlet />
    </Box>
  </Container>
);

export default AuthLayout;
