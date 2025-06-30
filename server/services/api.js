import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ Uses environment variable
});

// 🔑 Reset Password
export const resetPassword = async (data) => {
  try {
    const response = await api.post("/reset-password", data);
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error.message, error.response?.data);
    throw error;
  }
};

// 🚪 Logout
export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error.message, error.response?.data);
    throw error;
  }
};

// 💊 Search Medicines
export const searchMedicines = async (query) => {
  try {
    const response = await api.get(`/medicines?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Search medicines error:", error.message, error.response?.data);
    throw error;
  }
};

// 🏥 Search Hospitals
export const searchHospitals = async (location) => {
  try {
    const response = await api.get(`/hospitals?location=${encodeURIComponent(location)}`);
    return response.data;
  } catch (error) {
    console.error("Search hospitals error:", error.message, error.response?.data);
    throw error;
  }
};

// 🤖 Get AI Response
export const getAIResponse = async (prompt) => {
  try {
    const response = await api.post("/ai-response", { prompt });
    return response.data;
  } catch (error) {
    console.error("AI response error:", error.message, error.response?.data);
    throw error;
  }
};

export default api;
