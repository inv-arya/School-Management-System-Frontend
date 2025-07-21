import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { axiosInstance } from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import withRoleAccess from '../../hoc/withRoleAccess';

const ExamList = () => {
  const { role } = useAuth(); 
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExams = async () => {
    try {
      let endpoint = '';
      if (role === 'teacher') {
        endpoint = '/exams/my/';
      } else if (role === 'student') {
        endpoint = '/exams/available/';
      }
      console.log("aese")
      const response = await axiosInstance.get(endpoint);
      setExams(response.data.results); 
      console.log(response.data)
    } catch (err) {
      setError('Failed to load exams.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [role]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          {role === 'teacher' && 'My Created Exams'}
          {role === 'student' && 'Available Exams'}
        </Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && exams.length === 0 && (
          <Alert severity="info">No exams found.</Alert>
        )}

        {!loading && exams.length > 0 && (
          <List>
            {exams.map((exam) => (
              <React.Fragment key={exam.id}>
                <ListItem>
                  <ListItemText
                    primary={exam.title}
                    secondary={`Created At: ${new Date(exam.created_at).toLocaleString()}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default withRoleAccess(ExamList, ['teacher', 'student']);