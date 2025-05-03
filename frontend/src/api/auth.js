import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Update this to your backend URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests when available
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Register a new user
export const register = async (name, email, password) => {
  try {
    const { data } = await api.post('/register', { name, email, password });
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Registration failed';
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const { data } = await api.post('/login', { email, password });
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Login failed';
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const { data } = await api.get('/profile');
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to get profile';
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const { data } = await api.put('/profile', userData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to update profile';
  }
};