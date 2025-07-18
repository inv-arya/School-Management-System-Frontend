import React from "react";
import { Container, Typography, Paper, Box } from "@mui/material";

const Dashboard = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: "100%" }}>
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            Welcome to the School Management System
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;
