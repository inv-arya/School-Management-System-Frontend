


import { useEffect, useState } from 'react';
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
  Card,
  Avatar,
  Grid,

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


  const handleSoftDelete = async (studentId) => {
    try {
      await axiosInstance.patch(`/students/${studentId}/`, {
        status: 'inactive',
      });
      fetchStudents(page);
    } catch (error) {
      console.error('Failed to soft delete student:', error);
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
      ) : role === 'student' ? (
        students.length > 0 ? (
          <Card sx={{ p: 4, mt: 3, borderRadius: 4, boxShadow: 4, background: '#f5f7fa' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{ width: 80, height: 80, mr: 3, bgcolor: '#1976d2', fontSize: 32 }}
              >
                {students[0].first_name[0]}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {students[0].first_name} {students[0].last_name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  @{students[0].user.username}
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid xs={12} sm={6}>
                <Typography variant="body1"><strong>Email:</strong> {students[0].email}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="body1"><strong>Phone Number:</strong> {students[0].phone_number}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="body1"><strong>Roll Number:</strong> {students[0].roll_number}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="body1"><strong>Grade:</strong> {students[0].grade}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="body1"><strong>Date of Birth:</strong> {students[0].date_of_birth}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="body1"><strong>Admission Date:</strong> {students[0].admission_date}</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="body1"><strong>Status:</strong>
                  <span style={{
                    color: students[0].status === 'active' ? '#2e7d32' : '#d32f2f',
                    fontWeight: 'bold',
                    marginLeft: 6
                  }}>
                    {students[0].status.toUpperCase()}
                  </span>
                </Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Assigned Teacher:</strong> {students[0].assigned_teacher ? `#${students[0].assigned_teacher}` : 'Not Assigned'}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        ) : (
          <Typography>No profile found.</Typography>
        )
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

                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => navigate(`/students/edit/${student.id}`)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {student.status !== 'inactive' && (
                          <Tooltip title="Soft Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleSoftDelete(student.id)}
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

      <ProtectedRegisterStudentButton onClick={() => navigate('/students/register')} />
    </Container>
  );
};

export default Students;
