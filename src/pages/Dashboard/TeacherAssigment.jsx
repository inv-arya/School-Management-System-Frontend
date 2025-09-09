import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Fab,
  CircularProgress,
  Box,
  Pagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/axios"; 
import { useAuth } from '../../auth/AuthContext';

const TeacherAssigment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const { role } = useAuth();
  const pageSize = 5;

  useEffect(() => {
    fetchAssignments(page);
  }, [page]);

  const fetchAssignments = async (page = 1) => {
    try {
      const res = await axiosInstance.get(`/assignments/list/?page=${page}`);
      setAssignments(res.data.results);
      setCount(res.data.count);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const totalPages = Math.ceil(count / pageSize);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/assignments/${deleteId}/`);
      setAssignments(assignments.filter((a) => a.id !== deleteId));
    } catch (error) {
      console.error("Error deleting assignment:", error);
    } finally {
      setDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container className="py-6">
      <Typography variant="h4" gutterBottom>
        Assignments
      </Typography>

      {assignments.map((assignment) => (
        <Accordion key={assignment.id} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ flexGrow: 1 }}>
              {assignment.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(assignment.created_at).toLocaleDateString()}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography><b>Description:</b> {assignment.description}</Typography>
            <Typography><b>Subject:</b> {assignment.subject}</Typography>
            <Typography><b>Grade:</b> {assignment.grade}</Typography>
            <Typography><b>Deadline:</b> {new Date(assignment.deadline).toLocaleString()}</Typography>
            <Typography><b>Max Marks:</b> {assignment.max_marks}</Typography>

            {assignment.reference_files && (
              <Button
                variant="outlined"
                href={`${assignment.reference_files}`}
                target="_blank"
                sx={{ mt: 1 }}
              >
                View Reference File
              </Button>
            )}

            <div className="flex gap-3 mt-3">
              <Button
                variant="contained"
                onClick={() =>
                  navigate(
                    role === 'admin'
                      ? `/assignment/submission/${assignment.id}`
                      : `/teacher-assignments/submissions/${assignment.id}`
                  )
                }
              >
                {role === 'admin' ? 'Overdue Submissions' : 'Submissions'}
              </Button>
              {role == 'teacher' && (
                <>
              <IconButton
                color="primary"
                disabled={new Date(assignment.deadline) < new Date()}
                onClick={() => navigate(`/teacher-assignments/edit/${assignment.id}`)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                disabled={new Date(assignment.deadline) < new Date()}
                onClick={() => {
                  setDeleteConfirm(true);
                  setDeleteId(assignment.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
              </>)}
            </div>
          </AccordionDetails>
          
        </Accordion>
      ))}

      <Box display="flex" justifyContent="center" mt={3}>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        )}
      </Box>
      {role == 'teacher' && (
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 20, right: 20 }}
          onClick={() => navigate("/teacher-assignments/create")}
        >
          <AddIcon />
        </Fab>
      )}
      
      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle>Are you sure you want to delete this assignment?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TeacherAssigment;

