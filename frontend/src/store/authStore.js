import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      const { token, user } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      set({ user, token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data || 'Login failed', loading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      await axios.post('/api/auth/register', data);
      set({ loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data || 'Registration failed', loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  deleteAccount: async () => {
    set({ loading: true, error: null });
    try {
      await axios.delete('/api/users/me');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data || 'Failed to delete account', loading: false });
      return false;
    }
  }
}));

// Set up Axios interceptor for JWT
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default useAuthStore;
