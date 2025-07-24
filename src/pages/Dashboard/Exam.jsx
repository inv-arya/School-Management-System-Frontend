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
          <>
            <List>
              {exams.map((exam) => {
                const isExpanded = expandedExamIds.includes(exam.id);
                return (
                  <React.Fragment key={exam.id}>
                    <ListItem
                      sx={{ alignItems: 'flex-start' }}
                      secondaryAction={
                        <Stack direction="row" spacing={1} sx={{
                          float: 'right',
                          mt: {
                            xs: '5rem',    
                            sm: '4rem',
                            md: '4rem',
                            lg: 0     
                          }
                        }}>
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
                        </Stack>
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
                        {role === 'teacher' && (
                          
                            <Tooltip title="Delete Exam">
                            <IconButton
                                color="error"
                                size="small"
                                onClick={() => setExamToDelete(exam.id)}
                              >
                                <DeleteOutlineOutlinedIcon />
                              </IconButton>
                              </Tooltip>
                          
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
    </Container>
  );
};

export default withRoleAccess(ExamList, ['teacher', 'student']);