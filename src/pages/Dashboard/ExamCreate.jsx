import React from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  IconButton,
  Grid,
} from '@mui/material';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { axiosInstance } from '../../api/axios';
import withRoleAccess from '../../hoc/withRoleAccess';

const ExamCreate = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      questions: [
        {
          text: '',
          options: [
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false },
            { text: '', is_correct: false },
          ],
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: 'questions' });

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('/exams/create/', data);
      alert('Exam created successfully!');
      reset();
    } catch (error) {
      console.error(error);
      alert('Failed to create exam.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create Exam
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
            {...register('duration_minutes', { required: 'Time Duration is required' })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          {questionFields.map((question, qIndex) => (
            <Box key={question.id} sx={{ mt: 3, mb: 2, border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
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
                      />
                      {' '}
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

          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Submit Exam
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default withRoleAccess(ExamCreate, ['teacher']);
