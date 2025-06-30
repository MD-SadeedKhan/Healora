import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/forgot-password", { email });
      const message = response.data.message;
      setError(typeof message === "string" ? message : JSON.stringify(message));
      navigate(`/reset?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message;
      setError(
        typeof errMsg === "string"
          ? errMsg
          : JSON.stringify(errMsg || "Failed to send OTP. Please try again.")
      );
      console.error("❌ [ForgotPassword] Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#52c3f4] flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#296a9e] font-['Poppins']">Healora</h1>
            </div>
            <h2 className="text-2xl font-semibold text-white font-['Poppins'] drop-shadow-sm">
              Forgot Password
            </h2>
          </div>

          <form onSubmit={handleRequestOtp} className="space-y-5">
            {error && (
              <div className="p-2 bg-red-500/20 text-red-200 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="email" className="text-white font-medium drop-shadow-sm">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30 rounded-xl h-11 backdrop-blur-sm"
                  placeholder="Enter your email address"
                  required
                  aria-label="Email address"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending OTP...
                </div>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/90 text-sm drop-shadow-sm">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="text-white font-semibold transition-colors hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
