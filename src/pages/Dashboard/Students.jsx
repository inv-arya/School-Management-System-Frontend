


import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Box,
  Tooltip,
  IconButton,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';

import withRoleAccess from '../../hoc/withRoleAccess';
import { useAuth } from '../../auth/AuthContext';
import withRoleFab from '../../components/RoleFab';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [csvFile, setCsvFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const { role } = useAuth();
  const navigate = useNavigate();
  const pageSize = 2;

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

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!csvFile) {
      setUploadStatus('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await axiosInstance.post('/students/import-csv/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadStatus(` ${response.data.message}`);
      if (response.data.errors.length > 0) {
        console.error('Some rows failed:', response.data.errors);
      }
      fetchStudents();
    } catch (error) {
      setUploadStatus('Upload failed');
      console.error('CSV upload error:', error);
    }
  };

  const ProtectedRegisterStudentButton = withRoleFab(['admin', 'teacher']);

  const CSVImportSection = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6">Import Students from CSV</Typography>
      <input type="file" onChange={handleFileChange} />
      {csvFile && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Selected file: {csvFile.name}
        </Typography>
      )}
      <Button variant="contained" sx={{ ml: 2 }} onClick={handleUpload}>
        Upload CSV
      </Button>
      {uploadStatus && (
        <Typography sx={{ mt: 1 }} color="primary">
          {uploadStatus}
        </Typography>
      )}
    </Box>
  );

  const ProtectedCSVImportSection = withRoleAccess(CSVImportSection, ['admin']);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {role === 'student' ? 'Profile' : 'Students'}
      </Typography>

      <ProtectedCSVImportSection />

      {loading ? (
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
                    'Roll Number',
                    'Grade',
                    'Date of Birth',
                    'Admission Date',
                    'Status',
                    'Assigned Teacher',
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
                {students.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>
                      {student.first_name} {student.last_name}
                    </TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>{student.user.username}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>{student.email}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>{student.phone_number}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>{student.roll_number}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>{student.grade}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>{student.date_of_birth}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>{student.admission_date}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>{student.status}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #eee' }}>
                      {student.assigned_teacher ? `#${student.assigned_teacher}` : 'Not Assigned'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Student">
                          <IconButton color="primary" size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Student">
                          <IconButton color="error" size="small">
                            <DeleteIcon fontSize="small" />
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

      <ProtectedRegisterStudentButton onClick={() => navigate('/students/register')} />
    </Container>
  );
};

export default Students;
