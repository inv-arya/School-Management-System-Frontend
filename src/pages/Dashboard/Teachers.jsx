import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Pagination,
  Paper,
  Box,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
import withRoleAccess from '../../hoc/withRoleAccess';
import withRoleFab from '../../components/RoleFab';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const pageSize = 5;

  const fetchTeachers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/teachers/?page=${page}`);
      setTeachers(response.data.results);
      setCount(response.data.count);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers(page);
  }, [page]);

  const totalPages = Math.ceil(count / pageSize);

  const ProtectedRegisterTeacherButton = withRoleFab(['admin']);

  
  return (
    <Container sx={{ mt: 4, position: 'relative' }}>
      <Typography variant="h4" gutterBottom>
        All Teachers
      </Typography>

      {loading ? 
      (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={3}>
            {teachers.map((teacher) => (
              <Grid item xs={12} sm={6} md={4} key={teacher.id}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {teacher.first_name} {teacher.last_name}
                  </Typography>
                  <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
                    <div><strong>Username:</strong> {teacher.user.username}</div>
                    <div><strong>Email:</strong> {teacher.email}</div>
                    <div><strong>Phone:</strong> {teacher.phone_number}</div>
                    <div><strong>Subject:</strong> {teacher.subject_specialization}</div>
                    <div><strong>Employee ID:</strong> {teacher.employee_id}</div>
                    <div><strong>Date of Joining:</strong> {teacher.date_of_joining}</div>
                    <div><strong>Status:</strong> {teacher.status}</div>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
            />
          )}
        </>
      )}
      <ProtectedRegisterTeacherButton onClick={() => navigate('/teachers/register')} />
    </Container>
  );
};

export default TeacherList;

