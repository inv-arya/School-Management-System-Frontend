import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Container, Typography, TextField, Button, Box , InputAdornment,IconButton} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { login } from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";


export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setIsAuthenticated, setRole } = useAuth();

    const onSubmit = async (data) => {
        try {
        const { role } = await login({
        username: data.username,
        password: data.password,
        });

        setIsAuthenticated(true);
        setRole(role);

        navigate("/dashboard");
        } catch (error) {
        
        setError("password", {
            type: "manual",
            message: "Invalid username or password",
        });
        }
    };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Login
      </Typography>

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          {...register("username", {
            required: "Username is required",
          })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          {...register("password", {
            required: "Password is required",
           
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
        <Typography variant="body2" align="right" sx={{ mt: 1 }}>
           <Link to="/forgot-password">Forgot Password?</Link>
        </Typography>
      </Box>
    </Container>
  );
}

