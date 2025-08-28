import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Paper, CircularProgress, Button } from "@mui/material";
import { axiosInstance } from "../../api/axios";

const AssignmentDetailPage = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await axiosInstance.get(`/assignments/${id}/`);
        setAssignment(res.data);
      } catch (error) {
        console.error("Error fetching assignment", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
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

    try {
      const res = await axiosInstance.put("/assignments/submissions/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Submission updated successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      const errorMessage = error.response?.data?.error || "Failed to update submission";
      alert(errorMessage);
    }
  };

  if (loading) return <CircularProgress />;
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
        <input type="file" onChange={handleFileChange} />
        <Button variant="contained" color="primary" onClick={handleUpload} sx={{ mt: 2 }}>
          Update Submission
        </Button>
      </Paper>
    </Container>
  );
};

export default AssignmentDetailPage;