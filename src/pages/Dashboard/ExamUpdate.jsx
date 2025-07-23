import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  IconButton,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useForm, useFieldArray } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
import withRoleAccess from '../../hoc/withRoleAccess';

const ExamUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      duration_minutes: '',
      questions: [],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });

  
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axiosInstance.get(`/exams/${id}/`);
        reset(res.data);
      } catch (err) {
        setFetchError('Failed to load exam.');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setSubmitError('');
    try {
      await axiosInstance.put(`/exams/${id}/`, data);
      alert('Exam updated successfully!');
      navigate('/exams');
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to update exam.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (fetchError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{fetchError}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Update Exam
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Exam Title"
            fullWidth
            margin="normal"
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            label="Time Duration"
            fullWidth
            margin="normal"
            {...register('duration_minutes', {
              required: 'Duration is required',
            })}
            error={!!errors.duration_minutes}
            helperText={errors.duration_minutes?.message}
          />

          {questionFields.map((question, qIndex) => (
            <Box
              key={question.id || qIndex}
              sx={{ mt: 3, mb: 2, border: '1px solid #ccc', p: 2, borderRadius: 2 }}
            >
              <Typography variant="subtitle1">Question {qIndex + 1}</Typography>
              <TextField
                label="Question Text"
                fullWidth
                margin="normal"
                {...register(`questions.${qIndex}.text`, {
                  required: 'Question text is required',
                })}
                error={!!errors.questions?.[qIndex]?.text}
                helperText={errors.questions?.[qIndex]?.text?.message}
              />

              <Grid container spacing={2}>
                {Array.from({ length: 4 }).map((_, optIndex) => (
                  <Grid item xs={6} key={optIndex}>
                    <TextField
                      label={`Option ${optIndex + 1}`}
                      fullWidth
                      {...register(`questions.${qIndex}.options.${optIndex}.text`, {
                        required: 'Option text is required',
                      })}
                      error={!!errors.questions?.[qIndex]?.options?.[optIndex]?.text}
                      helperText={errors.questions?.[qIndex]?.options?.[optIndex]?.text?.message}
                    />
                    <label>
                      <input
                        type="checkbox"
                        {...register(`questions.${qIndex}.options.${optIndex}.is_correct`)}
                      />{' '}
                      Correct
                    </label>
                  </Grid>
                ))}
              </Grid>

              {questionFields.length > 1 && (
                <IconButton color="error" onClick={() => removeQuestion(qIndex)}>
                  <RemoveIcon />
                </IconButton>
              )}
            </Box>
          ))}

          <Button
            type="button"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() =>
              appendQuestion({
                text: '',
                options: [
                  { text: '', is_correct: false },
                  { text: '', is_correct: false },
                  { text: '', is_correct: false },
                  { text: '', is_correct: false },
                ],
              })
            }
          >
            Add Question
          </Button>

          {submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}

          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Update Exam
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default withRoleAccess(ExamUpdate, ['teacher']);
