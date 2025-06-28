import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Index from "./pages/Index.jsx"; // Dashboard
import Demo from "./pages/Demo.jsx";
import Contact from "./pages/Contact.jsx";
import Privacy from "./pages/Privacy.jsx";
import Chat from "./pages/Chat.jsx"; // AI Assistant
import MedicineSearch from "./pages/MedicineSearch.jsx";
import SavedMedicines from "./components/SavedMedicines.jsx";
import Hospitals from "./pages/Hospitals.jsx";
import SupportCenter from "./pages/SupportCenter.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/useAuth";
import FAQ from "./pages/FAQ.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import HealthRecords from "./pages/HealthRecords.jsx";
import Profile from "./pages/Profile.jsx"; // ✅ New import

// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ [ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-100">
          <div className="text-center p-4">
            <h1 className="text-2xl font-bold text-red-600">
              Oops! Something went wrong.
            </h1>
            <p className="text-gray-600 mt-2">
              Error: {this.state.error?.message || "Unknown error"}
            </p>
            <a href="/" className="mt-4 inline-block text-blue-500 underline">
              Go back home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log(
    "📍 [App] user:",
    user ? { id: user.id, name: user.name } : null,
    "loading:",
    loading,
    "location:",
    location.pathname
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/support-center" element={<SupportCenter />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-records"
          element={
            <ProtectedRoute>
              <HealthRecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medicine-search"
          element={
            <ProtectedRoute>
              <MedicineSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-medicines"
          element={
            <ProtectedRoute>
              <SavedMedicines />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospitals"
          element={
            <ProtectedRoute>
              <Hospitals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile" // ✅ New route
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
