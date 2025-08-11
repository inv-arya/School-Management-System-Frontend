import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import axios from "axios";

export default function ChatApproval({ action }) {
  const { token } = useParams();
  const navigate = useNavigate();
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch chat request details before approval/cancel
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/chat/requests/${token}/`)
      .then((res) => {
        setChatData(res.data);
      })
      .catch(() => {
        setMessage("Invalid or expired chat request.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleAction = (status) => {
    setSubmitting(true);
    axios
      .put(`http://127.0.0.1:8000/api/chat/requests/${status}/${token}/`)
      .then((res) => {
        setMessage(`Chat request ${status}d successfully.`);
      })
      .catch(() => {
        setMessage("Error updating chat request.");
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) return <CircularProgress />;

  if (message && !chatData) return <Typography>{message}</Typography>;

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 8, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Chat Request Approval
        </Typography>
        <Typography>
          Teacher: {chatData.teacher_name}
          <br />
          Student: {chatData.student_name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Token: {token}
        </Typography>

        {message && <Typography color="primary" sx={{ mt: 2 }}>{message}</Typography>}

        {!message && (
          <>
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 3, mr: 2 }}
              onClick={() => handleAction("approve")}
              disabled={submitting}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 3 }}
              onClick={() => handleAction("cancel")}
              disabled={submitting}
            >
              Cancel
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
