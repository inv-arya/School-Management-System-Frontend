
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
import { useAuth } from "../auth/AuthContext";

const drawerWidth = 240;

const Sidebar = ({ onDrawerToggle, mobileOpen }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { logout, role } = useAuth();

  const handleLogout = () => {
    logout();                    
    navigate("/");         
  };

  const navItems = [];

  if (role === "admin") {
    navItems.push({ text: "Teachers", path: "/teachers" });
    navItems.push({ text: "Students", path: "/students" });
    navItems.push({ text: "Assignment", path: "/teacher-assignments" });
  } else if (role === "teacher") {
    navItems.push({ text: "Students", path: "/students" });
    navItems.push({ text: "Exam", path: "/exams" });
    navItems.push({ text: "Assignment", path: "/teacher-assignments" });
  } else if (role === "student") {
    navItems.push({ text: "My Profile", path: "/students" });
    navItems.push({ text: "Exam", path: "/exams" });
    navItems.push({ text: "Assignment", path: "/student-assignments" });
  }

  const drawerContent = (
    <Box onClick={isMobile ? onDrawerToggle : undefined} sx={{ textAlign: "center" }}>
      <Toolbar />
      <Divider />
      <List>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/dashboard")}>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
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
            keepMounted: true, 
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
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
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
