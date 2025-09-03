import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Button,
  TextField,
  Link,
  Box,
} from "@mui/material";
import { axiosInstance } from "../../api/axios";

const AssignmentDetailPage = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  const backendBaseUrl = "http://localhost:8000"; 
  useEffect(() => {
    const fetchAssignmentAndSubmission = async () => {
      try {
        const [assignmentRes, submissionRes] = await Promise.all([
          axiosInstance.get(`/assignments/${id}/`),
          axiosInstance.get(`/assignments/submissions/${id}/`),
        ]);
        setAssignment(assignmentRes.data);
        setSubmission(submissionRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
        setError(error.response?.data?.error || "Failed to fetch assignment or submission");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignmentAndSubmission();
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    
    const formData = new FormData();
    formData.append("assignment_id", id);
    formData.append("submission_file", file);
    console.log(formData);
    
    try {
      const res = await axiosInstance.put("/assignments/submissions/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmission(res.data); 
      alert("Submission updated successfully!");
      setFile(null); 
    } catch (error) {
      console.error("Upload failed", error);
      const errorMessage = error.response?.data?.error || "Failed to update submission";
      alert(errorMessage);
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
        {assignment.reference_files && (
          <Link
                  href={`http://localhost:8000${assignment.submission_files}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View refernce File
                </Link>
        )}
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Submission Details
        </Typography>
        {submission ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              Status: {submission.status_display || "Not Submitted"}
            </Typography>
            <Typography variant="body2">
              Submitted At: {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : "N/A"}
            </Typography>
            <Typography variant="body2">
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
              )}
            </Typography>
            {submission.marks != null && (
              <Typography variant="body2">Marks: {submission.marks}</Typography>
            )}
          </Box>
        ) : (
          <Typography>No submission yet</Typography>
        )}
        <TextField
          type="file"
          onChange={handleFileChange}
          sx={{ mt: 2 }}
          inputProps={{ accept: ".pdf,.jpg,.jpeg,.png,.ppt,.pptx" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          sx={{ mt: 2, ml: 2 }}
          disabled={submission?.status === 2 || new Date(assignment.deadline) < new Date()} 
        >
          {submission?.status === 1 ? "Replace Submission" : "Upload Submission"}
        </Button>
      </Paper>
    </Container>
  );
};

export default AssignmentDetailPage;


