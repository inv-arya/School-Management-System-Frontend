// src/components/Sidebar.jsx
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navItems = [
    
    { text: "Teachers", path: "/teachers" },
    { text: "Students", path: "/students" },
  ];

   const drawerContent = (
    <Box onClick={isMobile ? onDrawerToggle : undefined} sx={{ textAlign: 'center' }}>
      <Toolbar />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );


  return (
     <>
      {/* Temporary Drawer for Mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better performance on mobile
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Permanent Drawer for Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
