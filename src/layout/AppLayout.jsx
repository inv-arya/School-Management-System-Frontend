import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Box, Toolbar } from "@mui/material";

const AppLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* For spacing below AppBar */}
        <Outlet />
      </Box>
    </Box>
  )
}

export default AppLayout
