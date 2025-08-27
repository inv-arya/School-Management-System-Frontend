import { useEffect, useState } from "react";
import { Container, Typography, List, ListItemButton, ListItemText, CircularProgress, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/axios";

const SubjectsListPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axiosInstance.get("/assignments/subjects/");
        setSubjects(res.data.subjects);
      } catch (error) {
        console.error("Error fetching subjects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h5" gutterBottom>Available Subjects</Typography>
      <Paper>
        <List>
          {subjects.map((subject, idx) => (
            <ListItemButton 
              key={idx} 
              onClick={() => navigate(`/student-assignments/${subject}`)}
            >
              <ListItemText primary={subject} />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default SubjectsListPage;
