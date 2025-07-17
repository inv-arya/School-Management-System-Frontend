import React,{ useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Box, Toolbar } from "@mui/material";

const drawerWidth = 240;

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

   return (
    <Box sx={{ display: 'flex' }}>
      <Header onDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle}  drawerWidth={drawerWidth} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 , width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` },}} >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppLayout
