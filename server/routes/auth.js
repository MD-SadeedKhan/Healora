const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // Changed to bcryptjs to match models/User.js
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const PasswordReset = require("../models/PasswordReset");

// Factory function to create transporter with enhanced debugging
const createTransporter = () => {
  console.log(
    "📧 [Auth] Creating transporter with EMAIL_USER:",
    process.env.EMAIL_USER
  );
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 15000,
    logger: true,
    debug: true,
  });
  transporter.verify((error, success) => {
    if (error) console.error("❌ [Auth] Transporter verification error:", error);
    else console.log("✅ [Auth] Transporter is ready:", success);
  });
  return transporter;
};

// Generate OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Register (Step 1: Send OTP)
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log("📝 [Auth] Register attempt:", { email });
  try {
    if (!firstName || !lastName || !email || !password) {
      console.warn("⚠️ [Auth] Missing required fields:", req.body);
      throw new Error("Missing required fields");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("⚠️ [Auth] Email already registered:", email);
      return res
        .status(400)
        .json({ error: "Email already registered as a verified user" });
    }

    const existingPending = await PendingUser.findOne({ email });
    if (existingPending) {
      const otp = generateOTP();
      existingPending.otp = otp;
      existingPending.createdAt = Date.now();
      await existingPending.save();

      const transporter = createTransporter();
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "✅ Verify Your Healora Account",
        html: `<p>Your new OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p><p>Click <a href="http://localhost:5173/verify">here</a> to verify.</p>`,
      });
      console.log("📧 [Auth] Registration Email sent:", info.response);

      return res
        .status(200)
        .json({ message: "A new OTP has been sent to your email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const pendingUser = new PendingUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      otp,
    });
    await pendingUser.save();

    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "✅ Verify Your Healora Account",
      html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p><p>Click <a href="http://localhost:5173/verify">here</a> to verify.</p>`,
    });
    console.log("📧 [Auth] Registration Email sent:", info.response);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("❌ [Auth] Registration error:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  console.log("📝 [Auth] Resend OTP attempt:", { email });
  try {
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      console.warn("⚠️ [Auth] No pending registration found:", email);
      return res.status(400).json({ error: "No pending registration found" });
    }

    const otp = generateOTP();
    pendingUser.otp = otp;
    pendingUser.createdAt = Date.now();
    await pendingUser.save();

    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "✅ Verify Your Healora Account",
      html: `<p>Your new OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p><p>Click <a href="http://localhost:5173/verify">here</a> to verify.</p>`,
    });
    console.log("📧 [Auth] Resend OTP Email sent:", info.response);

    res.status(200).json({ message: "OTP resent to your email" });
  } catch (error) {
    console.error("❌ [Auth] Resend OTP error:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// Verify OTP (Complete Registration)
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  console.log("📝 [Auth] Verify OTP attempt:", { email });
  try {
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      console.warn("⚠️ [Auth] No pending registration found:", email);
      return res.status(400).json({ error: "No pending registration found" });
    }

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    console.log(
      "📅 [Auth] Current time:",
      new Date(),
      "CreatedAt:",
      pendingUser.createdAt,
      "TenMinutesAgo:",
      tenMinutesAgo
    );
    if (pendingUser.createdAt < tenMinutesAgo) {
      await PendingUser.deleteOne({ email });
      console.warn("⚠️ [Auth] OTP expired for:", email);
      return res
        .status(400)
        .json({ error: "OTP has expired. Please register again" });
    }

    const receivedOtp = otp.toString().replace(/\s/g, "");
    const storedOtp = pendingUser.otp.toString();
    console.log(
      "🔍 [Auth] Received OTP:",
      receivedOtp,
      "Stored OTP:",
      storedOtp
    );

    if (receivedOtp !== storedOtp) {
      console.warn("⚠️ [Auth] Invalid OTP for:", email);
      return res.status(400).json({ error: "Invalid OTP. Please try again" });
    }

    console.log("✅ [Auth] OTP verified for:", email);
    const user = new User({
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      email: pendingUser.email,
      password: pendingUser.password,
      recentQueries: [],
      savedMedicines: [],
      appointments: [],
    });
    await user.save();

    await PendingUser.deleteOne({ email });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ [Auth] Verify OTP error:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("📝 [Auth] Login attempt:", { email });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.warn("⚠️ [Auth] User not found:", email);
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password); // Use schema method
    if (!isMatch) {
      console.warn("⚠️ [Auth] Password mismatch for:", email);
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ [Auth] Login successful:", { userId: user._id, email });
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ [Auth] Login error:", error.message, error.stack);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
});

// Forgot Password (Send OTP)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("📝 [Auth] Forgot password attempt:", { email });
  try {
    let user = await User.findOne({ email });
    let attempts = 0;
    const maxAttempts = 3;
    while (!user && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      user = await User.findOne({ email });
      attempts++;
    }
    if (!user) {
      console.warn("⚠️ [Auth] Email not found:", email);
      return res.status(400).json({ error: "Email not found" });
    }

    const existingReset = await PasswordReset.findOne({ email });
    if (existingReset) {
      await PasswordReset.deleteOne({ email });
    }

    const otp = generateOTP();
    const passwordReset = new PasswordReset({ email, otp });
    await passwordReset.save();

    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "✅ Reset Your Healora Password",
      html: `<p>Your OTP to reset your password is <strong>${otp}</strong>. It is valid for 10 minutes.</p><p>Click <a href="http://localhost:5173/reset">here</a> to reset.</p>`,
    });
    console.log("📧 [Auth] Forgot Password Email sent:", info.response);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("❌ [Auth] Forgot password error:", {
      message: error.message,
      stack: error.stack,
    });
    const pendingUser = await PendingUser.findOne({ email });
    if (pendingUser) {
      console.log("⚠️ [Auth] Email in PendingUser, not verified:", email);
      return res
        .status(400)
        .json({ error: "Please verify your email before requesting a password reset" });
    }
    res.status(500).json({ error: "Failed to send OTP. Please try again" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  console.log("📝 [Auth] Reset password attempt:", { email });
  try {
    const passwordReset = await PasswordReset.findOne({ email });
    if (!passwordReset || passwordReset.otp !== otp) {
      console.warn("⚠️ [Auth] Invalid or expired OTP for:", email);
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    if (passwordReset.createdAt < tenMinutesAgo) {
      await PasswordReset.deleteOne({ email });
      console.warn("⚠️ [Auth] OTP expired for:", email);
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired. Please request a new one" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.warn("⚠️ [Auth] User not found for:", email);
      return res.status(400).json({ success: false, message: "User not found" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await PasswordReset.deleteOne({ email });

    console.log("✅ [Auth] Password reset successful for:", email);
    res.status(200).json({
      success: true,
      message: "Password Reset Successful! Redirecting to login...",
    });
  } catch (error) {
    console.error("❌ [Auth] Reset password error:", error.message, error.stack);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
});

module.exports = router;