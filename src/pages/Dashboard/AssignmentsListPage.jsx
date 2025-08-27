import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, List, ListItemButton, ListItemText, CircularProgress, Paper } from "@mui/material";
import { axiosInstance } from "../../api/axios";

const AssignmentsListPage = () => {
  const { subject } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axiosInstance.get(`/assignments/list/?subject=${subject}`);
        setAssignments(res.data);
      } catch (error) {
        console.error("Error fetching assignments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [subject]);

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h5" gutterBottom>{subject} Assignments</Typography>
      <Paper>
        <List>
          {assignments.map((assignment) => (
            <ListItemButton 
              key={assignment.id} 
              onClick={() => navigate(`/student/assignment/${assignment.id}`)}
            >
              <ListItemText 
                primary={assignment.title} 
                secondary={`Deadline: ${new Date(assignment.deadline).toLocaleString()}`} 
              />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default AssignmentsListPage;
