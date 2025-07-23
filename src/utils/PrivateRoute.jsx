
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { CircularProgress, Box } from "@mui/material";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated ,loading} = useAuth();
  

   if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  
  console.log(isAuthenticated,'11');
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
