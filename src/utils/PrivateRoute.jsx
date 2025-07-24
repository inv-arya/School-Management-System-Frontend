
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

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
  
  
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
