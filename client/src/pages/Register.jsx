import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Heart,
  Key,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/useAuth";
import api from "../services/api"; // Import the configured api instance

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("register");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const otpInputRefs = useRef([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Keep this for initial state check
  }, [user, navigate]);

  useEffect(() => {
    if (step === "otp" && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [step, resendTimer]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setOtpError("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long!");
      setIsLoading(false);
      return;
    }

    if (!formData.termsAccepted) {
      setMessage("You must accept the Terms and Conditions to proceed.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      setMessage(response.data.message);
      setStep("otp");
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Registration failed. Please try again."
      );
      console.error("Registration error:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setOtpError("");
    setMessage("");

    const enteredOtp = otp.join("");
    console.log("Submitting OTP:", enteredOtp);
    try {
      const response = await api.post("/verify-otp", {
        email: formData.email,
        otp: enteredOtp,
      });
      if (response.status === 201) {
        const { token, user: userData } = response.data;
        console.log("Register userData:", userData);
        if (login) {
          login(userData);
          localStorage.setItem("token", token);
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
            navigate("/dashboard");
          }, 2500);
        }
      }
    } catch (error) {
      setOtpError("Invalid OTP. Please try again.");
      console.error("OTP verification error:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setMessage("");

    try {
      const response = await api.post("/resend-otp", {
        email: formData.email,
      });
      setMessage(response.data.message);
      setResendTimer(30);
      setCanResend(false);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to resend OTP.");
      console.error("Resend OTP error:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setOtpError("");

      if (value && index < 5) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTermsChange = (e) => {
    setFormData({
      ...formData,
      termsAccepted: e.target.checked,
    });
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
              <h1 className="text-3xl font-bold text-[#1e3a8a] font-['Poppins']">
                Healora
              </h1>
            </div>
            <h2 className="text-2xl font-semibold text-white font-['Poppins'] drop-shadow-sm">
              {step === "register" ? "Join Healora Today" : "Verify Your Email"}
            </h2>
          </div>

          {step === "register" ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="firstName"
                    className="text-white font-medium drop-shadow-sm"
                  >
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30 rounded-xl h-11 backdrop-blur-sm"
                      placeholder="First name"
                      required
                      aria-label="First name"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="lastName"
                    className="text-white font-medium drop-shadow-sm"
                  >
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30 rounded-xl h-11 backdrop-blur-sm"
                      placeholder="Last name"
                      required
                      aria-label="Last name"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="email"
                  className="text-white font-medium drop-shadow-sm"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30 rounded-xl h-11 backdrop-blur-sm"
                    placeholder="Enter your email address"
                    required
                    aria-label="Email address"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="password"
                  className="text-white font-medium drop-shadow-sm"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30 rounded-xl h-11 backdrop-blur-sm"
                    placeholder="Create a strong password"
                    required
                    aria-label="Password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="confirmPassword"
                  className="text-white font-medium drop-shadow-sm"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30 rounded-xl h-11 backdrop-blur-sm"
                    placeholder="Confirm your password"
                    required
                    aria-label="Confirm password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    id="terms"
                    name="termsAccepted"
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={handleTermsChange}
                    className="h-4 w-4 text-blue-500 border-white/30 rounded focus:ring-blue-500 focus:ring-offset-0"
                    required
                  />
                  <Label
                    htmlFor="terms"
                    className="text-white font-medium drop-shadow-sm flex items-center text-sm"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-[#1e3a8a] underline mx-1">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-[#1e3a8a] underline mx-1"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !formData.termsAccepted}
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

              {message && (
                <p className="text-center text-white/90 mt-2">{message}</p>
              )}
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="text-center">
                <p className="text-white/90 text-sm mb-4">
                  We’ve sent a 6-digit OTP to {formData.email}. Please enter it
                  below.
                </p>
                {otpError && (
                  <div className="p-2 bg-red-500/20 text-red-200 rounded-xl text-sm mb-4">
                    {otpError}
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
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      className="w-12 h-12 text-center text-lg font-medium bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30 rounded-xl backdrop-blur-sm"
                      required
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-white/90 text-sm">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-white font-semibold hover:underline transition-colors"
                      disabled={isLoading}
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span>Resend OTP in {resendTimer}s</span>
                  )}
                </p>
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
                    Verifying...
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("register")}
                  className="text-white/90 text-sm hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  Back to Registration
                </button>
              </div>

              {message && (
                <p className="text-center text-white/90 mt-2">{message}</p>
              )}
            </form>
          )}

          {step === "register" && (
            <div className="mt-6 text-center">
              <p className="text-white/90 text-sm drop-shadow-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-white font-semibold transition-colors hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {showSuccessModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 text-center shadow-2xl animate-fade-in">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white font-['Poppins'] mb-2">
                  Successfully Registered!
                </h3>
                <p className="text-white/90 mb-4">
                  Welcome to Healora. Redirecting to your dashboard...
                </p>
                <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
