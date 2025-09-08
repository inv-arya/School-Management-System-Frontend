import { useEffect, useState, useRef, useCallback } from 'react';
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
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [error, setError] = useState(null);
  const [chatStatus, setChatStatus] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(null);
  const { chatId } = useParams();
  const { role, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const participantName = location.state?.participantName || 'Unknown User';
  const WS_BASE_URL = 'ws://127.0.0.1:8000/ws/chat/';
  const chatBoxRef = useRef(null);
  const wsRef = useRef(null);
  const observer = useRef();
  const isReconnecting = useRef(false);

  const lastMessageRef = useCallback(
    (node) => {
      if (!hasMore || (totalPages && page >= totalPages)) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, page, totalPages]
  );

  useEffect(() => {
    if (!loading) {
      const fetchMessages = async () => {
        try {
          const response = await axiosInstance.get(`/chat/get-messages/${chatId}/?page=${page}`);
          const data = response.data.results || response.data;
          if (response.data.count && !totalPages) {
            const pages = Math.ceil(response.data.count / 5);
            setTotalPages(pages);
          }
          if (data.length === 0) {
            setHasMore(false);
            return;
          }

          const normalized = [...data].reverse();
          if (page === 1) {
            setMessages(normalized);
            setTimeout(() => {
              if (chatBoxRef.current) {
                chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
              }
            }, 0);
          } else {
            const prevHeight = chatBoxRef.current.scrollHeight;
            setMessages((prev) => [...normalized, ...prev]);
            setTimeout(() => {
              chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight - prevHeight;
            }, 0);
          }
        } catch (err) {
          if (err.response?.status === 404) {
            setHasMore(false);
          } else {
            setError('Failed to fetch chat data');
            setSnackbar({ open: true, message: 'Failed to fetch chat data' });
          }
        }
      };

      fetchMessages();
    }
  }, [chatId, loading, page, totalPages]);

  useEffect(() => {
    if (!loading) {
      let isMounted = true; 

      const fetchChatStatus = async () => {
        try {
          const statusResponse = await axiosInstance.get(`/chat/check-status-by-id/${chatId}/`);
          if (isMounted) setChatStatus(statusResponse.data.status || 2); 
        } catch (err) {
          if (isMounted) { 
            setError('Failed to fetch chat status');
            setSnackbar({ open: true, message: 'Failed to fetch chat status' });
          }
        }
      };

      fetchChatStatus();

      
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        return; 
      }

      
      const token = localStorage.getItem('access');
      if (!token) {
        setError('No authentication token found');
        setSnackbar({ open: true, message: 'No authentication token found' });
        return;
      }

      const websocket = new WebSocket(`${WS_BASE_URL}${chatId}/?token=${token}`);
      wsRef.current = websocket;
      setWs(websocket);

      websocket.onopen = () => {
        console.log('WebSocket connected');
        isReconnecting.current = false;
        if (isMounted) setError(null); 
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.error) {
          if (isMounted) { 
            setError(data.error);
            setSnackbar({ open: true, message: data.error });
          }
        } else {
          setMessages((prev) => {
            const exists = prev.some(
              (msg) =>
                msg.timestamp === data.timestamp &&
                msg.message === data.message &&
                msg.sender_type === (data.sender.includes('Teacher') ? 0 : 1)
            );
            if (exists) return prev;

            const newMessages = [
              ...prev,
              {
                id: data.id || data.timestamp || Date.now(),
                sender_type: data.sender.includes('Teacher') ? 0 : 1,
                message: data.message,
                timestamp: data.timestamp,
              },
            ];

            if (
              chatBoxRef.current &&
              chatBoxRef.current.scrollHeight - chatBoxRef.current.scrollTop - chatBoxRef.current.clientHeight < 50
            ) {
              setTimeout(() => {
                if (chatBoxRef.current) {
                  chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                }
              }, 0);
            }

            return newMessages;
          });
        }
      };

      websocket.onerror = (e) => {
        console.log('WebSocket error', e);
        if (!isReconnecting.current && isMounted) { 
          setError('WebSocket connection failed');
          setSnackbar({ open: true, message: 'WebSocket connection failed' });
        }
      };

      websocket.onclose = (event) => {
        console.log('WebSocket closed', event);
        if (event.code === 4001) {
          if (isMounted) { 
            setSnackbar({ open: true, message: 'Your account has been deactivated by the admin.' });
            setTimeout(() => {
              localStorage.clear();
              navigate('/');
            }, 2000);
          }
        } else if (!isReconnecting.current && isMounted) { 
          isReconnecting.current = true;
          setTimeout(() => {
            if (isMounted) { 
              console.log('Attempting to reconnect WebSocket...');
              
              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;
              const newToken = localStorage.getItem('access');
              if (!newToken) {
                setError('No authentication token found');
                setSnackbar({ open: true, message: 'No authentication token found' });
                return;
              }
              const newWebsocket = new WebSocket(`${WS_BASE_URL}${chatId}/?token=${newToken}`);
              wsRef.current = newWebsocket;
              setWs(newWebsocket);
              newWebsocket.onopen = websocket.onopen;
              newWebsocket.onmessage = websocket.onmessage;
              newWebsocket.onerror = websocket.onerror;
              newWebsocket.onclose = websocket.onclose;
            }
          }, 3000);
        }
      };

      return () => {
        isMounted = false; 
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          isReconnecting.current = true;
          wsRef.current.close(1000, 'Component unmounting');
          wsRef.current = null;
        }
      };
    }
  }, [chatId, loading, navigate]); 

  const sendMessage = () => {
    if (
      newMessage.trim() &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      chatStatus === 1
    ) {
      wsRef.current.send(JSON.stringify({ message: newMessage }));
      setNewMessage('');
    } else if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setSnackbar({ open: true, message: 'Cannot send message: WebSocket not connected' });
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
      <Box
        ref={chatBoxRef}
        sx={{ height: '60vh', overflowY: 'auto', mb: 2, p: 2, bgcolor: '#f5f7fa', borderRadius: 2 }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={`${msg.id}-${idx}`}
            ref={idx === 0 ? lastMessageRef : null}
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
              <Typography>{`${msg.message}-${msg.id}`}</Typography>
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