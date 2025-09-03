import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Pagination,
} from "@mui/material";
import { axiosInstance } from "../../api/axios"; 


const AdminSubmission = () => {
  
  const [submissions, setSubmissions] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { id } = useParams();

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {

        const [assignmentRes, submissionsRes] = await Promise.all([
          axiosInstance.get(`/assignments/${id}/`),
          axiosInstance.get(`/assignments/submissions/overdue/${id}/?page=${page}`),
        ]);
        setAssignment(assignmentRes.data);
        setSubmissions(submissionsRes.data.results);
        setTotalPages(Math.ceil(submissionsRes.data.count / 5));
      } catch (error) {
        console.error("Error fetching data", error);
        setError(error.response?.data?.error || error.response?.data?.detail || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    checkAdminAndFetchData();
  }, [id,page]);

  const handleExport = async (format) => {
    try {
      const response = await axiosInstance.get(`/assignments/submissions/overdue/${id}/export?formats=${format}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const extension = format === "excel" ? "xlsx" : "pdf";
      link.setAttribute('download', `overdue_submissions_${id}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error exporting ${format}`, error);
      alert(error.response?.data?.error || `Failed to export as ${format}`);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
//   if (!isAdmin) return null; 

  return (
    <Container>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {assignment ? `${assignment.title} - Overdue Submissions` : `Overdue Submissions for Assignment ${assignment_id}`}
        </Typography>
        {assignment && (
          <>
            <Typography variant="body1" gutterBottom>{assignment.description}</Typography>
            <Typography variant="body2" gutterBottom>Subject: {assignment.subject}</Typography>
            <Typography variant="body2" gutterBottom>Grade: {assignment.grade}</Typography>
            <Typography variant="body2" gutterBottom>
              Deadline: {new Date(assignment.deadline).toLocaleString()}
            </Typography>
            <Typography variant="body2" gutterBottom>Max Marks: {assignment.max_marks}</Typography>
          </>
        )}
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Overdue Students
        </Typography>
        {submissions.length === 0 ? (
          <Typography>No overdue submissions found</Typography>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((submission, index) => (
                    <TableRow key={index}>
                      <TableCell>{submission.student_name || "Unknown Student"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleExport("excel")}
              >
                Export to Excel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleExport("pdf")}
              >
                Export to PDF
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default AdminSubmission;