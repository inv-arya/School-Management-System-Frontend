import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Pagination,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
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


  const handleSoftDelete = async (teacherId) => {
    try {
      await axiosInstance.patch(`/teachers/${teacherId}/`, {
        status: 'inactive',
      });
      fetchTeachers(page);
    } catch (error) {
      console.error('Error soft deleting teacher:', error);
    }
  };


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
           <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1976d2' }}>
                  {[
                    'Name',
                    'Username',
                    'Email',
                    'Phone',
                    'Subject',
                    'Employee ID',
                    'Date of Joining',
                    'Status',
                    'Actions',
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: '#fff',
                        fontWeight: 'bold',
                        borderRight: '1px solid #ddd',
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id} hover>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>
                      {teacher.first_name} {teacher.last_name}
                    </TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>
                      {teacher.user.username}
                    </TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>{teacher.email}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>{teacher.phone_number}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>{teacher.subject_specialization}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>{teacher.employee_id}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>{teacher.date_of_joining}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>{teacher.status}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Teacher">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => navigate(`/teachers/edit/${teacher.id}`)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {teacher.status !== 'inactive' && (
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleSoftDelete(teacher.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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

