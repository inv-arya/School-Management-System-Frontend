import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, Grid, Typography, MenuItem, Box, InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const Register = () => {
  const navigate = useNavigate();
  const { role ,loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [teacherId, setTeacherId] = useState(null);
  const [allTeachers, setAllTeachers] = useState([]);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm();

  const assignedTeacher = watch('assigned_teacher');

  const onSubmit = async (data) => {
    try {
      const payload = {
        user: {
          username: data.username,
          email: data.email,
          password: data.password,
          role: 'student',
          first_name: data.first_name,
          last_name: data.last_name,
        },
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        roll_number: data.roll_number,
        grade: data.grade,
        date_of_birth: data.date_of_birth,
        admission_date: data.admission_date,
        status: data.status,
        assigned_teacher: data.assigned_teacher || null,
      };

      await axiosInstance.post('/students/', payload);
      navigate('/students');
    } catch (error) {
      if (error.response?.data?.email) {
        setError('email', { message: error.response.data.email[0] });
      }
      if (error.response?.data?.roll_number) {
        setError('roll_number', { message: error.response.data.roll_number[0] });
      }
      if (error.response?.data?.user?.username) {
        setError('username', { message: error.response.data.user.username[0] });
      }
      if (error.response?.data?.user?.password) {
        setError('password', { message: error.response.data.user.password[0] });
      }
    }
  };
  useEffect(() => {

    if (loading) return;

    if (role === 'teacher') {
      axiosInstance.get('/teachers/me/')
        .then((res) => {
          setTeacherId(res.data.id);
          setValue('assigned_teacher', res.data.id);
        })
        .catch((err) => console.error('Error fetching teacher:', err));
    }

    if (role === 'admin') {
      axiosInstance.get('/teachers/')
        .then((res) => {
        const data = res.data.results;
        setAllTeachers(data);
        if (data.length > 0) {
          setValue('assigned_teacher', data[0].id); 
        }
      })
        .catch((err) => console.error('Error fetching teacher list:', err));
    }
  }, [role, setValue,loading]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Register Student
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2} sx={{display:'flex',flexDirection:'column'}}>
          {/* User Fields */}
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
              {...register('password', { required: 'Password is required' ,minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                validate: {
                  hasLetterAndNumber: (value) =>
                    /^(?=.*[A-Za-z])(?=.*\d)/.test(value) ||
                    'Password must include at least one letter and one number',
                },})}
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

          {/* Student Info */}
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
              {...register('phone_number', { required: 'Phone number is required' ,pattern: {
                value: /^[0-9]{10}$/,
                message: 'Phone number must be exactly 10 digits',
              },})}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Roll Number"
              fullWidth
              {...register('roll_number', { required: 'Roll number is required',pattern: {
                value: /^REG-\d{4}-\d{3}$/,
                message: 'Format must be REG-YYYY-XXX (e.g., REG-2025-001)',
              } })}
              error={!!errors.roll_number}
              helperText={errors.roll_number?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Grade"
              
              fullWidth
              {...register('grade', { required: 'Grade is required' })}
              error={!!errors.grade}
              helperText={errors.grade?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('date_of_birth', { required: 'Date of birth is required' })}
              error={!!errors.date_of_birth}
              helperText={errors.date_of_birth?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Admission Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('admission_date', { required: 'Admission date is required' })}
              error={!!errors.admission_date}
              helperText={errors.admission_date?.message}
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

          {role === 'teacher' && teacherId && (
            <input type="hidden" {...register('assigned_teacher', { required: true })} value={teacherId} />
          )}

          {role === 'admin' && (
            <Grid item xs={12} sm={6}>
              
              <TextField
                select
                label="Assigned Teacher"
                fullWidth
                value={assignedTeacher || ''}
                onChange={(e) => setValue('assigned_teacher', e.target.value)}
                error={!!errors.assigned_teacher}
                helperText={errors.assigned_teacher?.message}
              >
                {allTeachers.map((t) => (
                  <MenuItem key={t.id} value={t.id}>{t.first_name} {t.last_name}</MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box textAlign="right">
              <Button type="submit" variant="contained" color="primary">
                Register Student
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Register;
