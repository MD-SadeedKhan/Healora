// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Reset Password
export const resetPassword = async (data) => {
  try {
    const response = await api.post('/reset-password', data);
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error.message, error.response?.data);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.message, error.response?.data);
    throw error;
  }
};

// Search Medicines
export const searchMedicines = async (query) => {
  try {
    const response = await api.get(`/medicines?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Search medicines error:', error.message, error.response?.data);
    throw error;
  }
};

// Search Hospitals
export const searchHospitals = async (location) => {
  try {
    const response = await api.get(`/hospitals?location=${encodeURIComponent(location)}`);
    return response.data;
  } catch (error) {
    console.error('Search hospitals error:', error.message, error.response?.data);
    throw error;
  }
};

// Get AI Response
export const getAIResponse = async (prompt) => {
  try {
    console.log('📡 [API] Sending AI request with prompt:', prompt);
    const response = await api.post('/ai-response', { prompt });
    console.log('✅ [API] AI response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [API] AI response error:', error.message, error.response?.data);
    throw error;
  }
};

export default api;