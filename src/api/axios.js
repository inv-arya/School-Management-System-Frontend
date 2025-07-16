// src/api/axios.js
import axios from 'axios';

const apiEndpoint = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

let isRefreshing = false;

const axiosInstance = axios.create({
  baseURL: apiEndpoint,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
});

// ✅ Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem('access');
    if (access) {
      config.headers['Authorization'] = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor to refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorCode = error.response?.data?.errorCode;

    // Token expired: E100102 = access expired, E100103 = refresh expired
    if (
      error.response?.status === 401 &&
      errorCode === 'E100102' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            localStorage.setItem('access', newAccessToken);
            isRefreshing = false;
            return axiosInstance(originalRequest);
          }
        } catch (err) {
          window.location.replace('/login');
          return Promise.reject(err);
        }
      }
    } else if (
      error.response?.status === 401 &&
      errorCode === 'E100103'
    ) {
      // Refresh token expired: logout
      localStorage.clear();
      window.location.replace('/login');
    }

    return Promise.reject(error);
  }
);

// ✅ Token refresh function (uses Django JWT)
async function refreshAccessToken() {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) throw new Error('No refresh token available');

  try {
    const response = await axios.post(`${apiEndpoint}/auth/token/refresh/`, {
      refresh,
    });
    return response.data?.access;
  } catch (error) {
    console.error('Failed to refresh access token', error);
    throw error;
  }
}

async function login({ username, password }) {
  try {
    
    const response = await axiosInstance.post("/auth/token/", {
      username,
      password,
    });
console.log('response');

    const { access, refresh, role, username: returnedUsername } = response.data;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("role", role);
    localStorage.setItem("username", returnedUsername);

    return { access, refresh, role, username: returnedUsername };
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
}

export { axiosInstance ,login };
