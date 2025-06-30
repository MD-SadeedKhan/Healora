import axios from 'axios';

// Create Axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://healora-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Fixed syntax
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Forgot Password
export const forgotPassword = async (data) => {
  const response = await api.post('/forgot-password', data);
  return response.data;
};

// Reset Password
export const resetPassword = async (data) => {
  const response = await api.post('/reset-password', data);
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};

// Search Medicines
export const searchMedicines = async (query) => {
  const response = await api.get(`/medicines?query=${encodeURIComponent(query)}`); // Fixed template literal
  return response.data;
};

// Search Hospitals
export const searchHospitals = async (location) => {
  const response = await api.get(`/hospitals?location=${encodeURIComponent(location)}`); // Fixed template literal
  return response.data;
};

// Get AI Response
export const getAIResponse = async (prompt) => {
  const response = await api.post('/ai-response', { prompt });
  return response.data;
};

export default api;