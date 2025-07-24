import React, { useState } from 'react';
import {
  Container, TextField, Button, Grid, Typography, MenuItem, Box, InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const RegisterTeacher = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const payload = {
        user: {
          username: data.username,
          email: data.email,
          password: data.password,
          role: 'teacher',
          first_name: data.first_name,
          last_name: data.last_name,
        },
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        subject_specialization: data.subject_specialization,
        employee_id: data.employee_id,
        date_of_joining: data.date_of_joining,
        status: data.status,
      };

      await axiosInstance.post('/teachers/', payload);
      navigate('/teachers');
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.email) {
        setError('email', { message: errData.email[0] });
      }
      if (errData?.employee_id) {
        setError('employee_id', { message: errData.employee_id[0] });
      }
      if (errData?.user?.username) {
        setError('username', { message: errData.user.username[0] });
      }
      if (errData?.user?.password) {
        setError('password', { message: errData.user.password[0] });
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Register Teacher
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2} sx={{display:'flex',flexDirection:'column'}}>

          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Username"
              fullWidth
              {...register('username', { required: 'Username is required' })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                validate: {
                  hasLetterAndNumber: (value) =>
                    /^(?=.*[A-Za-z])(?=.*\d)/.test(value) ||
                    'Password must include at least one letter and one number',
                },
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
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              {...register('confirm_password', {
                required: 'Please confirm password',
                validate: (val) =>
                  val === watch('password') || 'Passwords do not match',
              })}
              error={!!errors.confirm_password}
              helperText={errors.confirm_password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Teacher Info */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              fullWidth
              {...register('first_name', { required: 'First name is required' })}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              fullWidth
              {...register('last_name', { required: 'Last name is required' })}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              fullWidth
              {...register('phone_number', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Phone number must be exactly 10 digits',
                },
              })}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Subject Specialization"
              fullWidth
              {...register('subject_specialization', { required: 'Subject specialization is required' })}
              error={!!errors.subject_specialization}
              helperText={errors.subject_specialization?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Employee ID"
              fullWidth
              {...register('employee_id', { required: 'Employee ID is required',pattern: {
                value: /^EMP-\d{4}-\d{3}$/,
                message: 'Format must be EMP-YYYY-XXX (e.g., EMP-2025-001)',
              } })}
              error={!!errors.employee_id}
              helperText={errors.employee_id?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Joining"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('date_of_joining', { required: 'Date of joining is required' })}
              error={!!errors.date_of_joining}
              helperText={errors.date_of_joining?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Status"
              fullWidth
              defaultValue="active"
              {...register('status', { required: 'Status is required' })}
              error={!!errors.status}
              helperText={errors.status?.message}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Box textAlign="right">
              <Button type="submit" variant="contained" color="primary">
                Register Teacher
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default RegisterTeacher;
