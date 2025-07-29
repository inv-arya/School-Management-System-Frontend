import  { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';

const ExamAttempt = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null); 
  const [autoSubmitTriggered, setAutoSubmitTriggered] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axiosInstance.get(`/exams/${examId}/`);
        setExam(res.data);
        setRemainingTime(res.data.duration_minutes * 60);
      } 
      catch (err) {
        setError('Failed to load exam.');
      } 
      finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  // Countdown Timer
  useEffect(() => {
    if (remainingTime === null || result || autoSubmitTriggered) return;
console.log('1');

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          
            if (!autoSubmitTriggered) {
            setAutoSubmitTriggered(true); // ✅ prevent double-submit
            handleSubmit(true);           // ✅ auto submit
          }
                    
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime, result,autoSubmitTriggered]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };


  const handleChange = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async (auto = false) => {
    if (!exam || result) return;
console.log('4');

    const answers = Object.entries(selectedAnswers).map(([questionId, selectedOptionId]) => ({
      question_id: parseInt(questionId),
      selected_option_id: selectedOptionId,
    }));

    if (!auto &&answers.length !== exam.questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setSubmitLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/exams/attempt/', {
        exam_id: exam.id,
        answers,
      });
      setResult(res.data);
    } catch (err) {
      setError('Submission failed. You may have already attempted this exam.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error"> {error}</Alert>;
  if (!exam) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          {exam.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Duration: {exam.duration_minutes} minutes
        </Typography>

        {remainingTime !== null && !result && (
          <Alert severity={remainingTime <= 60 ? "warning" : "info"} sx={{ my: 2 }}>
             Time Remaining: <strong>{formatTime(remainingTime)}</strong>
          </Alert>
        )}

        <Box display="flex" flexDirection="column">
        {exam.questions.map((question,index) => (
          < FormControl key={question.id} component="fieldset" sx={{ mt: 3 }}>
            <FormLabel component="legend">
              Q{index + 1}: {question.text}
            </FormLabel>
            <RadioGroup
             
              value={selectedAnswers[question.id] || ''}
              onChange={(e) => handleChange(question.id, parseInt(e.target.value))}
            >
              {question.options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio />}
                  label={option.text}
                />
              ))}
            </RadioGroup>
          </FormControl>
        ))}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitLoading || Object.keys(selectedAnswers).length !== exam.questions.length}
          sx={{ mt: 4 }}
        >
          Submit Exam
        </Button>

        {result && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <strong>✅ Exam Submitted!</strong><br />
            Score: {result.score}%<br />
            Correct Answers: {result.correct_answers}/{result.total_questions}
            <br />
            <Button variant="outlined" onClick={() => navigate('/exams')} sx={{ mt: 2 }}>
              Back to Exams
            </Button>
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default ExamAttempt;
