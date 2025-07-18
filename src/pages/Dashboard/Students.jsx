import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  
  CircularProgress,
  Pagination,
  Paper,
  Box,
  Fab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {axiosInstance} from '../../api/axios'; 
import AddIcon from '@mui/icons-material/Add';
import withRoleAccess from '../../hoc/withRoleAccess'; 

const Students = () => {
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const pageSize = 5;

  const fetchStudents = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/students/?page=${page}`);
      setStudents(response.data.results);
      setCount(response.data.count);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const totalPages = Math.ceil(count / pageSize);

    const RegisterStudentButton = ({ onClick }) => (
    <Fab
      color="primary"
      aria-label="add"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 1000,
      }}
    >
      <AddIcon />
    </Fab>
  );

  const ProtectedRegisterStudentButton = withRoleAccess(RegisterStudentButton, ['admin', 'teacher']);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Students
      </Typography>

     

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={3}>
            {students.map((student) => (
              <Grid item xs={12} sm={6} md={4} key={student.id}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {student.first_name} {student.last_name}
                  </Typography>
                  <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
                    <div><strong>Username:</strong> {student.user.username}</div>
                    <div><strong>Email:</strong> {student.email}</div>
                    <div><strong>Phone:</strong> {student.phone_number}</div>
                    <div><strong>Roll Number:</strong> {student.roll_number}</div>
                    <div><strong>Grade:</strong> {student.grade}</div>
                    <div><strong>Date of Birth:</strong> {student.date_of_birth}</div>
                    <div><strong>Admission Date:</strong> {student.admission_date}</div>
                    <div><strong>Status:</strong> {student.status}</div>
                    <div><strong>Assigned Teacher:</strong> {student.assigned_teacher ? `#${student.assigned_teacher}` : 'Not Assigned'}</div>
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
      <ProtectedRegisterStudentButton onClick={() => navigate('/students/register')} />
    </Container>
  );
};

export default Students;
