// src/components/Header.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Header = () => {
  return (
    <AppBar position="static" elevation={1} sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Box display="flex" alignItems="center" width="100%">
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
              letterSpacing: 1,
              flexGrow: 1,
            }}
          >
            School Management System
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
