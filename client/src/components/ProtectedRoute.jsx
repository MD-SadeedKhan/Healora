import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  // Just enhance logs to check user.name
  console.log("🔒 [ProtectedRoute] user:", user);

  console.log(
    "🔒 [ProtectedRoute] user:",
    user ? { id: user.id, name: user.name } : null,
    "loading:",
    loading,
    "location:",
    location.pathname
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-[#5AC8FA]" />
      </div>
    );
  }

  if (!user) {
    console.warn("⚠️ [ProtectedRoute] No user found, redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
