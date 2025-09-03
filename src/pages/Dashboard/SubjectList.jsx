import { useEffect, useState } from "react";
import { Container, Typography, List, ListItemButton, ListItemText, CircularProgress, Paper,Pagination,
  Box,} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/axios";

const SubjectsListPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axiosInstance.get(`/assignments/subjects/?page=${page}`);
        setSubjects(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 5));
      } catch (error) {
        console.error("Error fetching subjects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [page]);

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
    </Container>
  );
};

export default SubjectsListPage;
