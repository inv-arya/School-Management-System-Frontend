import React, { useEffect, useState } from 'react';
import {
  TextField, Button, CircularProgress, Box, Typography, MenuItem
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';

const StudentEdit = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { register, handleSubmit, reset,watch,  formState: { errors } } =useForm({
});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

useEffect(() => {
  
  const fetchStudent = async () => {
    try {
      const res = await axiosInstance.get(`/students/${id}/`);
      const data = res.data;

      reset({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        roll_number: data.roll_number,
        grade: data.grade,
        date_of_birth: data.date_of_birth,
        admission_date: data.admission_date,
        status: data.status ,  
        assigned_teacher: data.assigned_teacher,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error loading student:", error);
      setServerError("Failed to load student data.");
      setLoading(false);
    }
  };

  fetchStudent();
}, [id, reset]);
  const onSubmit = async (data) => {
    setSubmitting(true);
    setServerError('');
    try {
      const payload = {
        ...data,
        user: undefined 
      };
      await axiosInstance.patch(`/students/${id}/`, payload);
      navigate('/students');
    } catch (err) {
      if (err.response?.data) {
        setServerError(JSON.stringify(err.response.data));
      } else {
        setServerError("Update failed.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" mb={3}>Edit Student</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth label="First Name" {...register('first_name', { required: true })}
          error={!!errors.first_name} helperText={errors.first_name && 'Required'}
          margin="normal"
        />
        <TextField
          fullWidth label="Last Name" {...register('last_name', { required: true })}
          error={!!errors.last_name} helperText={errors.last_name && 'Required'}
          margin="normal"
        />
        <TextField
          fullWidth label="Email" {...register('email', { required: true })}
          error={!!errors.email} helperText={errors.email && 'Required'}
          margin="normal"
        />
        <TextField
          fullWidth label="Phone Number" {...register('phone_number', { required: true })}
          error={!!errors.phone_number} helperText={errors.phone_number && 'Required'}
          margin="normal"
        />
        <TextField
          fullWidth label="Roll Number" {...register('roll_number', { required: true })}
          error={!!errors.roll_number} helperText={errors.roll_number && 'Required'}
          margin="normal"
        />
        <TextField
          fullWidth label="Grade" {...register('grade', { required: true })}
          error={!!errors.grade} helperText={errors.grade && 'Required'}
          margin="normal"
        />
        <TextField
          fullWidth label="Date of Birth" type="date"
          {...register('date_of_birth', { required: true })}
          InputLabelProps={{ shrink: true }}
          error={!!errors.date_of_birth} helperText={errors.date_of_birth && 'Required'}
          margin="normal"
        />
        <TextField
          fullWidth label="Admission Date" type="date"
          {...register('admission_date', { required: true })}
          InputLabelProps={{ shrink: true }}
          error={!!errors.admission_date} helperText={errors.admission_date && 'Required'}
          margin="normal"
        />
        <TextField
          select fullWidth label="Status"
            value={watch('status') || ''}  // prevent undefined value

          {...register('status', { required: true })}
          error={!!errors.status} helperText={errors.status && 'Required'}
          margin="normal"
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
        <TextField
          fullWidth label="Assigned Teacher ID (optional)"
          {...register('assigned_teacher')}
          margin="normal"
        />
        {serverError && <Typography color="error">{serverError}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Student'}
        </Button>
      </form>
    </Box>
  );
};

export default StudentEdit;

