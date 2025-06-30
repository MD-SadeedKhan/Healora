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
import api from "../services/api";

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
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const otpInputRefs = useRef([]);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  useEffect(() => {
    if (step === "otp" && resendTimer > 0) {
      const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [step, resendTimer]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setOtpError("");

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage("First and last names are required.");
      setIsLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long!");
      setIsLoading(false);
      return;
    }
    if (!formData.termsAccepted) {
      setErrorMessage("You must accept the Terms and Conditions to proceed.");
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
      setErrorMessage(response.data.message);
      setStep("otp");
      otpInputRefs.current[0]?.focus();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setOtpError("");
    setErrorMessage("");

    const enteredOtp = otp.join("");
    if (!/^\d{6}$/.test(enteredOtp)) {
      setOtpError("Please enter a valid 6-digit OTP.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/verify-otp", {
        email: formData.email,
        otp: enteredOtp,
      });
      if (response.status === 201) {
        const { token, user: userData } = response.data;
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
    } catch {
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setErrorMessage("");

    try {
      const response = await api.post("/resend-otp", {
        email: formData.email,
      });
      setErrorMessage(response.data.message);
      setResendTimer(30);
      setCanResend(false);
      otpInputRefs.current[0]?.focus();
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    // Update DOM value to ensure input displays the digit
    if (otpInputRefs.current[index]) {
      otpInputRefs.current[index].value = value;
    }

    // Auto-advance to next input or submit if last digit
    if (value && index < 5) {
      const nextInput = otpInputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    } else if (value && index === 5 && !newOtp.includes("")) {
      setTimeout(() => {
        document.querySelector("form")?.requestSubmit();
      }, 100);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = otpInputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      const nextInput = otpInputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      const prevInput = otpInputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasted)) {
      setOtpError("Pasted OTP must be exactly 6 digits");
      return;
    }

    const newOtp = pasted.split("").slice(0, 6);
    setOtp(newOtp);
    setOtpError("");

    // Update DOM values for all inputs
    newOtp.forEach((digit, idx) => {
      if (otpInputRefs.current[idx]) {
        otpInputRefs.current[idx].value = digit;
      }
    });

    const lastInput = otpInputRefs.current[5];
    if (lastInput) {
      lastInput.focus();
    }

    // Auto-submit if valid OTP
    if (!newOtp.includes("")) {
      setTimeout(() => {
        document.querySelector("form")?.requestSubmit();
      }, 100);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleTermsChange = (e) => {
    setFormData({ ...formData, termsAccepted: e.target.checked });
    setErrorMessage("");
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
                    aria-label={showPassword ? "Hide password" : "Show password"}
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

              {errorMessage && (
                <p
                  id="register-error"
                  className="text-center text-red-200 bg-red-500/20 p-2 rounded-xl mt-2"
                  role="alert"
                >
                  {errorMessage}
                </p>
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
                  <p
                    id="otp-error"
                    className="p-2 bg-red-500/20 text-red-200 rounded-xl text-sm mb-4"
                    role="alert"
                  >
                    {otpError}
                  </p>
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
                      onInput={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      className="w-12 h-12 text-center text-lg font-medium bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/30 rounded-xl backdrop-blur-sm"
                      required
                      disabled={isLoading}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="one-time-code"
                      aria-label={`OTP digit ${index + 1}`}
                      aria-describedby={otpError ? "otp-error" : undefined}
                      aria-invalid={otpError ? "true" : "false"}
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
                disabled={isLoading || otp.some((digit) => digit === "")}
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

              {errorMessage && (
                <p
                  id="otp-message"
                  className="text-center text-white/90 mt-2"
                  role="status"
                >
                  {errorMessage}
                </p>
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