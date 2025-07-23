import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const token = localStorage.getItem("access");
    const storedRole = localStorage.getItem("role");
    
    
     if (token && storedRole) {

      setIsAuthenticated(true);
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole(null);
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated,setIsAuthenticated,logout,role,setRole,loading}}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => useContext(AuthContext);