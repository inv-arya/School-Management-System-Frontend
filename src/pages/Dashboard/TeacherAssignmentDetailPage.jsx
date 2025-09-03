import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Link,
  TextField,
  Button,
  Box,
  Pagination,
} from "@mui/material";
import { axiosInstance } from "../../api/axios";

const TeacherAssignmentDetailPage = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marksInput, setMarksInput] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const backendBaseUrl = "http://localhost:8000"; 

  useEffect(() => {
    const fetchAssignmentAndSubmissions = async () => {
      try {
        const [assignmentRes, submissionsRes] = await Promise.all([
          axiosInstance.get(`/assignments/${id}/`),
          axiosInstance.get(`/assignments/${id}/submissions/?page=${page}`),
        ]);
        setAssignment(assignmentRes.data);
        setSubmissions(submissionsRes.data.results);
        setTotalPages(Math.ceil(submissionsRes.data.count / 5));
        
      } catch (error) {
        console.error("Error fetching data", error);
        setError(error.response?.data?.error || "Failed to fetch assignment or submissions");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignmentAndSubmissions();
  }, [id, page]);

  const handleMarksChange = (submissionId, value) => {
    setMarksInput((prev) => ({ ...prev, [submissionId]: value }));
  };

  const handleMarksSubmit = async (submissionId) => {
    const marks = marksInput[submissionId];
    if (!marks || isNaN(marks) || marks < 0) {
      alert("Please enter a valid number for marks (0 or greater)");
      return;
    }

    try {
      const response = await axiosInstance.put(`/submissions/`, { submission_id: submissionId, marks });
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submissionId ? { ...sub, marks: response.data.marks } : sub
        )
      );
      setMarksInput((prev) => ({ ...prev, [submissionId]: "" }));
      alert("Marks updated successfully!");
    } catch (error) {
      console.error("Error updating marks", error);
      alert(error.response?.data?.error || "Failed to update marks");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!assignment) return <Typography>No assignment found</Typography>;

  return (
    <Container>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>{assignment.title}</Typography>
        <Typography variant="body1" gutterBottom>{assignment.description}</Typography>
        <Typography variant="body2" gutterBottom>Subject: {assignment.subject}</Typography>
        <Typography variant="body2" gutterBottom>Grade: {assignment.grade}</Typography>
        <Typography variant="body2" gutterBottom>
          Deadline: {new Date(assignment.deadline).toLocaleString()}
        </Typography>
        <Typography variant="body2" gutterBottom>Max Marks: {assignment.max_marks}</Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Submitted Assignments
        </Typography>
        {submissions.length === 0 ? (
          <Typography>No submissions yet</Typography>
        ) : (
          <>
          <List >
            {submissions.map((submission) => (
              
              <ListItem
                key={submission.id}
                secondaryAction={
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      label={`Marks (0-${assignment.max_marks})`}
                      type="number"
                      size="small"
                      value={marksInput[submission.id] || ""}
                      onChange={(e) => handleMarksChange(submission.id, e.target.value)}
                      sx={{ width: "120px" }}
                      inputProps={{ min: 0, max: assignment.max_marks, step: 0.5 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleMarksSubmit(submission.id)}
                      disabled={!marksInput[submission.id] || isNaN(marksInput[submission.id])}
                    >
                      Submit Marks
                    </Button>
                  </Box>
                }
              >
             
                <ListItemText
                  primary={`Student: ${submission.student_name || "Unknown Student"}`}
                  secondary={
                    <>
                      Submitted: {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : "N/A"} |{" "}
                      File: {submission.submission_files ? (
                      <Link
                        href={`http://localhost:8000${submission.submission_files}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Submission File
                      </Link>
                      ) : (
                        "No file"
                      )} | Marks: {submission.marks != null ? submission.marks : "Not graded"}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
          {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
            </>
        )}
      </Paper>
    </Container>
  );
};

export default TeacherAssignmentDetailPage;