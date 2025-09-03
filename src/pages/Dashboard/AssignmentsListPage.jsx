import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, List, ListItemButton, ListItemText, CircularProgress, Paper,Box,
  Pagination,FormControl,InputLabel,Select,MenuItem } from "@mui/material";
import { axiosInstance } from "../../api/axios";

const AssignmentsListPage = () => {
  const { subject } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [sortBy, setSortBy] = useState("deadline");
  const [order, setOrder] = useState("asc");
  const navigate = useNavigate();
  const pageSize = 5;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axiosInstance.get(`/assignments/list/?subject=${subject}&page=${page}&sort_by=${sortBy}&order=${order}`);
        setAssignments(res.data.results);
        setCount(res.data.count);
      } catch (error) {
        console.error("Error fetching assignments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [subject, page, sortBy, order]);

  const handleSortChange = (event) => {
    const [newSortBy, newOrder] = event.target.value.split(":");
    setSortBy(newSortBy);
    setOrder(newOrder);
    setPage(1); 
  };


  if (loading) return <CircularProgress />;
  const totalPages = Math.ceil(count / pageSize);

  return (
    <Container>
      <Typography variant="h5" gutterBottom>{subject} Assignments</Typography>
      <Box sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={`${sortBy}:${order}`}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="deadline:asc">Deadline (Earliest First)</MenuItem>
            <MenuItem value="deadline:desc">Deadline (Latest First)</MenuItem>
            <MenuItem value="status:asc">Status (Not Submitted First)</MenuItem>
            <MenuItem value="status:desc">Status (Overdue First)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Paper>
        <List>
          {assignments.map((assignment) => (
            <ListItemButton 
              key={assignment.id} 
              onClick={() => navigate(`/student/assignment/${assignment.id}`)}
            >
              <ListItemText
                primary={assignment.title}
                secondary={`Deadline: ${new Date(assignment.deadline).toLocaleString()} | Status: ${assignment.status_display}`}
              />

            </ListItemButton>
          ))}
        </List>
      </Paper>
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
    </Container>
  );
};

export default AssignmentsListPage;
