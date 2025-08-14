import React, { useEffect, useState , useRef, useCallback} from 'react';
import {
  Container,
  Typography,
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
  Snackbar,
  Dialog, DialogTitle, DialogContent, DialogActions,Button, MenuItem, Select,Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel'; 
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
import withRoleFab from '../../components/RoleFab';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [openModal, setOpenModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentPage, setStudentPage] = useState(1);
  const [hasMoreStudents, setHasMoreStudents] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const navigate = useNavigate();
  const pageSize = 5;

  const observer = useRef();
  
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
  const fetchStudentsByTeacher = async (teacherId, page = 1) => {
    if (loadingStudents) return;
    setLoadingStudents(true);
    try {
      const res = await axiosInstance.get(`/students/by-teacher/${teacherId}/?page=${page}`);
      const newStudents = Array.isArray(res.data.results) ? res.data.results : [];

      setStudents((prev) => (page === 1 ? newStudents : [...prev, ...newStudents]));
      setHasMoreStudents(res.data.next !== null);
      setStudentPage(page);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoadingStudents(false);
    }
  };
  
  const openCancelModal = async (teacherId) => {
    try {
      setSelectedTeacherId(teacherId);
      setSelectedStudent('');
      setStudents([]);
      setStudentPage(1);
      setHasMoreStudents(true);
      setOpenModal(true);
      await fetchStudentsByTeacher(teacherId, 1);
      
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
      setOpenModal(true);
    }
  };
  
  const handleBulkCancel = async (teacherId) => {
    try {
      await axiosInstance.post(`/chat/requests/bulk-cancel-by-teacher/${teacherId}/`);
      setSnackbar({ open: true, message: 'Cancelled chat requests successfully', severity: 'success' });
      fetchTeachers(page); 
      setOpenModal(false); 
      } catch (error) {
    console.error('Error bulk cancelling chat requests:', error);
    setSnackbar({ open: true, message: 'Failed to cancel chat requests', severity: 'error' });
  }
  };

  const handleCancelForStudent = async (teacherId, studentId) => {
    try {
      await axiosInstance.post(`/chat/requests/cancel/${teacherId}/${studentId}/`);
      setSnackbar({ open: true, message: 'Cancelled chat request for student successfully', severity: 'success' });
      fetchTeachers(page);
      setOpenModal(false);
    } catch (error) {
      console.error('Error cancelling chat request for student:', error);
      const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Failed to cancel chat request';
      setSnackbar({ open: true, message: 'Failed to cancel chat request', severity: 'error' });
    }
  };

  const ProtectedRegisterTeacherButton = withRoleFab(['admin']);

  const lastStudentRef = useCallback(
    (node) => {
      if (loadingStudents) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreStudents) {
          fetchStudentsByTeacher(selectedTeacherId, studentPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingStudents, hasMoreStudents, studentPage, selectedTeacherId]
  );
  
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
                        <Tooltip title="Cancel Chat Requests">
                          <IconButton
                            color="warning"
                            size="small"
                            onClick={() => openCancelModal(teacher.id)}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Cancel Chat</DialogTitle>
      <DialogContent>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={() => handleBulkCancel(selectedTeacherId)}
        >
          Cancel All
        </Button>

        
        <Box
          sx={{ mt: 2, maxHeight: 300, overflowY: 'auto', border: '1px solid #ccc', p: 1 }}
          
        >
          {students.map((s, index) => {
              if (index === students.length - 1) {
                
                return (
                  <Button
                    key={s.id}
                    ref={lastStudentRef}
                    fullWidth
                    variant={selectedStudent === s.id ? 'contained' : 'outlined'}
                    color={selectedStudent === s.id ? 'warning' : 'primary'}
                    sx={{ mb: 1, textAlign: 'left' }}
                    onClick={() => setSelectedStudent(s.id)}
                  >
                    {s.first_name} {s.last_name}
                  </Button>
                );
              }
              return (
                <Button
                  key={s.id}
                  fullWidth
                  variant={selectedStudent === s.id ? 'contained' : 'outlined'}
                  color={selectedStudent === s.id ? 'warning' : 'primary'}
                  sx={{ mb: 1, textAlign: 'left' }}
                  onClick={() => setSelectedStudent(s.id)}
                >
                  {s.first_name} {s.last_name}
                </Button>
              );
            })}

            {loadingStudents && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <CircularProgress size={20} />
              </Box>
            )}

            {!hasMoreStudents && students.length === 0 && (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
                No students found
              </Typography>
            )}
        </Box>

        <Button
          variant="contained"
          color="warning"
          fullWidth
          sx={{ mt: 2 }}
          disabled={!selectedStudent}
          onClick={() => handleCancelForStudent(selectedTeacherId, selectedStudent)}
        >
          Cancel for Selected Student
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenModal(false)}>Close</Button>
      </DialogActions>
    </Dialog>

    </Container>
  );
};

export default TeacherList;

