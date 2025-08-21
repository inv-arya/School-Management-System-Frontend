import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Divider,
  Snackbar,
} from '@mui/material';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [error, setError] = useState(null);
  const [chatStatus, setChatStatus] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { chatId } = useParams();
  const { role, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const participantName = location.state?.participantName || "Unknown User";
  const WS_BASE_URL = 'ws://127.0.0.1:8000/ws/chat/';

  useEffect(() => {
    if (!loading) {
      
      const fetchChatData = async () => {
        try {
          const response = await axiosInstance.get(`/chat/get-messages/${chatId}/`);
          setMessages(response.data.results || response.data);
          
          const statusResponse = await axiosInstance.get(`/chat/check-status-by-id/${chatId}/`);
          setChatStatus(statusResponse.data.status || 2);
          
      
      const token = localStorage.getItem('access');
      const websocket = new WebSocket(`${WS_BASE_URL}${chatId}/?token=${token}`);
      websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        setError(data.error);
        setSnackbar({ open: true, message: data.error });
      } else {
      
        setMessages((prev) => {
          const exists = prev.some(
            (msg) =>
              msg.timestamp === data.timestamp &&
              msg.message === data.message &&
              msg.sender_type === (data.sender.includes('Teacher') ? 0 : 1)
          );
          if (exists) return prev;

          return [
            ...prev,
            {
              
              id: data.id || data.timestamp || Date.now(),
              sender_type: data.sender.includes('Teacher') ? 0 : 1,
              message: data.message,
              timestamp: data.timestamp,
            },
          ];
        });
      }
};

      websocket.onerror = (e) => {
        console.log('WebSocket error', e);
        
        setError('WebSocket connection failed');
        setSnackbar({ open: true, message: 'WebSocket connection failed' });
      };
      websocket.onclose = (event) => {
            console.log("WebSocket closed", event);
            if (event.code === 4001) {
              setSnackbar({ open: true, message: "Your account has been deactivated by the admin." });
              setTimeout(() => {
                localStorage.clear(); 
                navigate("/");   
              }, 2000);
            }
          };

          setWs(websocket);

          return () => websocket.close();
    
        } catch (err) {
          setError('Failed to fetch chat data');
          setSnackbar({ open: true, message: 'Failed to fetch chat data' });
        }
      };

      fetchChatData();
    }
  }, [chatId, loading]);

  const sendMessage = () => {
    if (newMessage.trim() && ws && chatStatus === 1) {
      ws.send(JSON.stringify({ message: newMessage }));
      setNewMessage('');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">{participantName}</Typography>
        <Button variant="outlined" onClick={() => navigate('/students')}>
          {role === 'student' ? 'Back to Profile' : 'Back to Students'}
        </Button>
      </Box>
      <Divider />
      <Box sx={{ height: '60vh', overflowY: 'auto', mb: 2, p: 2, bgcolor: '#f5f7fa', borderRadius: 2 }}>
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: msg.sender_type === (role.toUpperCase() === 'TEACHER' ? 0 : 1) ? 'flex-end' : 'flex-start',
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                p: 1,
                borderRadius: 2,
                bgcolor: msg.sender_type === (role.toUpperCase() === 'TEACHER' ? 0 : 1) ? 'primary.light' : 'grey.200',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Typography>
              <Typography>{msg.message}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {chatStatus !== 1 && (
        <Alert severity="info">
          {chatStatus === 0 ? 'Chat request pending approval' : 'Chat has been cancelled'}
        </Alert>
      )}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={chatStatus !== 1}
          size="small"
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={chatStatus !== 1 || !newMessage.trim()}
        >
          Send
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Container>
  );
};

export default Chat;