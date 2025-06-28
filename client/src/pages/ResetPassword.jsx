import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Lock, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import axios from "axios";
import SuccessMessage from "../components/SuccessMessage";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // New state for the success message
  const email = searchParams.get("email") || "";

  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShowSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const enteredOtp = otp.join("");
      const response = await axios.post("http://localhost:5000/api/reset-password", {
        email,
        otp: enteredOtp,
        newPassword,
      });
      if (response.data.success) {
        console.log("Success response:", response.data); // Debug log
        // Clear form on success
        setOtp(["", "", "", "", "", ""]);
        setNewPassword("");
        setConfirmNewPassword("");
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        setError("");
        // Set success message and show it
        setSuccessMessage(response.data.message);
        setShowSuccess(true);
        setTimeout(() => {
          console.log("Redirecting to login");
          navigate("/login");
        }, 3000); // 3-second delay
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return <SuccessMessage message={successMessage} />; // Use the stored success message
  }

  return (
    <div className="min-h-screen bg-[#52c3f4] flex items-center justify-center px-4 py-6 relative">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white font-['Poppins'] drop-shadow-sm">
              Reset Your Password
            </h2>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="text-center">
              <p className="text-white/90 text-sm mb-4">
                Enter the OTP sent to {email} and your new password.
              </p>
              {error && !showSuccess && (
                <div className="p-2 bg-red-500/20 text-red-200 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-white font-medium drop-shadow-sm flex items-center gap-2">
                <Key className="w-5 h-5" />
                Enter OTP
              </Label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-medium bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30 rounded-xl backdrop-blur-sm"
                    required
                    disabled={isLoading}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="newPassword" className="text-white font-medium drop-shadow-sm">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-12 pr-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30 rounded-xl h-11 backdrop-blur-sm"
                  placeholder="Enter new password"
                  required
                  aria-label="New password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmNewPassword" className="text-white font-medium drop-shadow-sm">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input
                  id="confirmNewPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="pl-12 pr-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30 rounded-xl h-11 backdrop-blur-sm"
                  placeholder="Confirm new password"
                  required
                  aria-label="Confirm new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
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
                  Resetting...
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;