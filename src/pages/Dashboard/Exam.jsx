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
  Button,
  Collapse,
  Box,
  Pagination,
} from '@mui/material';
import { axiosInstance } from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import withRoleAccess from '../../hoc/withRoleAccess';
import withRoleFab from '../../components/RoleFab';
import { useNavigate } from 'react-router-dom';

const ProtectedCreateExamButton = withRoleFab(['teacher']);

const ExamList = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedExamIds, setExpandedExamIds] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);

  const fetchExams = async (page) => {
    try {
      setLoading(true);
      let endpoint = '';
      if (role === 'teacher') {
        endpoint = `/exams/my/?page=${page}`;
      } else if (role === 'student') {
        endpoint = `/exams/available/?page=${page}`;
      }

      const response = await axiosInstance.get(endpoint);
      setExams(response.data.results);
      setCount(response.data.count);
    } catch (err) {
      setError('Failed to load exams.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams(page);
  }, [role, page]);

  const toggleExpand = (examId) => {
    setExpandedExamIds((prev) =>
      prev.includes(examId)
        ? prev.filter((id) => id !== examId)
        : [...prev, examId]
    );
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          {role === 'teacher' ? 'My Created Exams' : 'Available Exams'}
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && exams.length === 0 && (
          <Alert severity="info">No exams found.</Alert>
        )}

        {!loading && exams.length > 0 && (
          <>
            <List>
              {exams.map((exam) => {
                const isExpanded = expandedExamIds.includes(exam.id);
                return (
                  <React.Fragment key={exam.id}>
                    <ListItem
                      sx={{ alignItems: 'flex-start' }}
                      secondaryAction={
                        <>
                        {role === 'teacher' && (
                          <Button
                            onClick={() => toggleExpand(exam.id)}
                            variant="outlined"
                            size="small"
                          >
                            {isExpanded ? 'Hide Details' : 'View Details'}
                          </Button>
                        )}
                        {role === 'student' && (
                            <Button
                              onClick={() => navigate(`/exams/attempt/${exam.id}`)}
                              variant="contained"
                              size="small"
                              color="primary"
                            >
                              Attempt
                            </Button>
                        )}
                        </>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h6">{exam.title}</Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            Duration: {exam.duration_minutes} minutes | Created
                            At:{' '}
                            {new Date(exam.created_at).toLocaleString()}
                          </Typography>
                        }
                      />
                    </ListItem>

                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ pl: 4, pb: 2 }}>
                        {!exam.questions || exam.questions.length === 0 ? (
                          <Typography>No questions available.</Typography>
                        ) : (
                          exam.questions.map((question) => (
                            <Box key={question.id} sx={{ mb: 3 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Q: {question.text}
                              </Typography>
                              <List dense>
                                {question.options.map((option) => (
                                  <ListItem key={option.id} sx={{ pl: 4 }}>
                                    <ListItemText
                                      primary={option.text}
                                      primaryTypographyProps={{
                                        color: option.is_correct
                                          ? 'success.main'
                                          : 'text.primary',
                                        fontWeight: option.is_correct
                                          ? 'bold'
                                          : 'normal',
                                      }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          ))
                        )}
                      </Box>
                    </Collapse>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>

            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={Math.ceil(count / pageSize)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Paper>

      <ProtectedCreateExamButton onClick={() => navigate('/exams/create')} />
    </Container>
  );
};

export default withRoleAccess(ExamList, ['teacher', 'student']);
