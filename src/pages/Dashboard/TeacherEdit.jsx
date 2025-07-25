import  { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  CircularProgress,
  Box
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';

const TeacherEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      status: 'active'
    }
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const watchedStatus = watch('status');

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axiosInstance.get(`/teachers/${id}/`);
        const data = response.data;

        reset({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
          employee_id: data.employee_id,
          subject_specialization: data.subject_specialization,
          date_of_joining: data.date_of_joining,
          status: data.status || 'active'
        });

        setLoading(false);
      } catch (error) {
        setServerError('Failed to load teacher data.');
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id, reset]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    setServerError('');

    try {
      await axiosInstance.patch(`/teachers/${id}/`, {
        ...formData
      });
      navigate('/teachers');
    } catch (error) {
      if (error.response?.data) {
        setServerError(JSON.stringify(error.response.data));
      } else {
        setServerError('Update failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Edit Teacher
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="First Name"
            {...register('first_name', { required: true })}
            error={!!errors.first_name}
            helperText={errors.first_name && 'Required'}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            {...register('last_name', { required: true })}
            error={!!errors.last_name}
            helperText={errors.last_name && 'Required'}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            {...register('email', { required: true })}
            error={!!errors.email}
            helperText={errors.email && 'Required'}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone Number"
            {...register('phone_number', { required: true })}
            error={!!errors.phone_number}
            helperText={errors.phone_number && 'Required'}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Subject Specialization"
            {...register('subject_specialization', { required: true })}
            error={!!errors.subject_specialization}
            helperText={errors.subject_specialization && 'Required'}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Employee ID"
            {...register('employee_id', { required: true })}
            error={!!errors.employee_id}
            helperText={errors.employee_id && 'Required'}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Date of Joining"
            type="date"
            {...register('date_of_joining', { required: true })}
            InputLabelProps={{ shrink: true }}
            error={!!errors.date_of_joining}
            helperText={errors.date_of_joining && 'Required'}
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="Status"
            {...register('status', { required: true })}
            error={!!errors.status}
            helperText={errors.status && 'Required'}
            margin="normal"
            value={watchedStatus || ''}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>

          {serverError && (
            <Typography color="error" mt={2}>
              {serverError}
            </Typography>
          )}

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 3 }}
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update Teacher'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default TeacherEdit;
