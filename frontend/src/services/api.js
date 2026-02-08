import axios from 'axios';
import { useAuthStore } from '@store/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Only logout if it's not a login/register attempt
      useAuthStore.getState().logout();
      toast.error('Session expired. Please login again.');
    } else if (error.response?.data?.message) {
      // Display the specific error message from backend
      toast.error(error.response.data.message);
    } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      // Handle validation errors array
      const errorMsg = error.response.data.errors.map(err => err.msg).join(', ');
      toast.error(errorMsg);
    } else {
      toast.error('An error occurred. Please try again.');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Scores API
export const scoresAPI = {
  submit: (data) => api.post('/scores', data),
  getMyScores: (gameId) => api.get(`/scores/my/${gameId}`),
  getLeaderboard: (gameId, limit = 10) => api.get(`/scores/leaderboard/${gameId}`, { params: { limit } }),
  getRecent: (limit = 5) => api.get('/scores/recent', { params: { limit } }),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getLeaderboard: () => api.get('/users/leaderboard'),
};

// Games API
export const gamesAPI = {
  getAll: () => api.get('/games'),
  getById: (gameId) => api.get(`/games/${gameId}`),
};

// Questions API
export const questionsAPI = {
  getQuestions: (gameId, limit) => api.get(`/games/${gameId}/questions`, { params: { limit, random: true } }),
  getCount: (gameId) => api.get(`/games/${gameId}/questions/count`),
};

// Answers API
export const answersAPI = {
  submit: (gameId, data) => api.post(`/games/${gameId}/answers`, data),
  getSession: (gameId, sessionId) => api.get(`/games/${gameId}/sessions/${sessionId}/answers`),
};

// Analytics API
export const analyticsAPI = {
  track: (data) => api.post('/analytics/track', data).catch(() => {}),
  signup: () => api.post('/analytics/signup').catch(() => {}),
  summary: () => api.get('/analytics/summary'),
};

export default api;


