
import React from "react";
import {  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
  useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Header = ({ onDrawerToggle }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ justifyContent: isDesktop ? "center" : "flex-start" }}>
        {/* Menu button only visible on mobile */}
        {!isDesktop && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            fontWeight: "bold",
            letterSpacing: 1,
            textAlign: "center",
            flexGrow: isDesktop ? 0 : 1,
            width: isDesktop ? "auto" : "100%",
          }}
        >
          School Management System
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
