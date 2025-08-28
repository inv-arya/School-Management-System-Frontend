import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Paper, CircularProgress, List, ListItem, ListItemText, Link } from "@mui/material";
import { axiosInstance } from "../../api/axios";

const TeacherAssignmentDetailPage = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignmentAndSubmissions = async () => {
      try {
        const [assignmentRes, submissionsRes] = await Promise.all([
          axiosInstance.get(`/assignments/${id}/`),
          axiosInstance.get(`/assignments/${id}/submissions/`)
        ]);
        setAssignment(assignmentRes.data);
        setSubmissions(submissionsRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
        setError(error.response?.data?.error || "Failed to fetch assignment or submissions");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignmentAndSubmissions();
  }, [id]);

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
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Submitted Assignments</Typography>
        {submissions.length === 0 ? (
          <Typography>No submissions yet</Typography>
        ) : (
          <List>
            {submissions.map((submission) => (
              <ListItem key={submission.id}>
                <ListItemText
                  primary={`Student: ${submission.student_name}`}
                  secondary={
                    <>
                      Submitted: {new Date(submission.submitted_at).toLocaleString()} | 
                      File: <Link href={submission.submission_file} target="_blank">Download</Link>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default TeacherAssignmentDetailPage;