import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../api/axios";

import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Paper,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setServerError("");
    try {
       const response = await axiosInstance.post(
        `/auth/password-reset-confirm/${uid}/${token}/`,
        {
          password: data.password,
          password_confirm: data.passwordConfirm,
        },
        {
          headers: { Authorization: "" }, 
        }
      );
      setSuccessMsg(response.data.message || "Password reset successful!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      if (err.response?.data?.error) {
        setServerError(
          Array.isArray(err.response.data.error)
            ? err.response.data.error.join(" ")
            : err.response.data.error
        );
      } else if (err.response?.data) {
        setServerError(JSON.stringify(err.response.data));
      } else {
        setServerError("Network error. Please try again later.");
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        margin: "auto",
        p: 4,
        mt: 6,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
        Reset Password
      </Typography>

      {serverError && <Alert severity="error">{serverError}</Alert>}
      {successMsg && <Alert severity="success">{successMsg}</Alert>}

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
        <TextField
          fullWidth
          label="New Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          margin="normal"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Minimum 8 characters required" },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must contain letters and numbers (special chars allowed)",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Confirm New Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          margin="normal"
          {...register("passwordConfirm", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ mt: 3 }}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ResetPassword;
