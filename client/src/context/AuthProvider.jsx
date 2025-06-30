import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 [AuthProvider] Initializing auth...');
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const response = await axios.get('https://healora-backend.onrender.com/api/profile', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          const fetchedUser = response.data;

          setUser(fetchedUser);
          localStorage.setItem("user", JSON.stringify(fetchedUser));
          console.log('✅ [AuthProvider] User validated:', fetchedUser);
        } catch (error) {
          console.error("❌ [AuthProvider] Error validating user:", error.response?.data || error.message);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }

      setLoading(false);
      console.log('🏁 [AuthProvider] Auth initialized, loading:', false);
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    if (userData && userData.name && userData.id && userData.email) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log('✅ [AuthProvider] Login successful:', userData);
    } else {
      console.warn("⚠️ [AuthProvider] Invalid user data provided to login:", userData);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log('✅ [AuthProvider] Logout successful');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};