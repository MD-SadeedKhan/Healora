const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const PasswordReset = require("../models/PasswordReset");

// Factory function to create transporter
const createTransporter = () => {
  console.log("📧 [Auth] Creating transporter with EMAIL_USER:", process.env.EMAIL_USER);
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

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register - Send OTP
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
      return res.status(400).json({ error: "Email already registered as a verified user" });
    }

    const existingPending = await PendingUser.findOne({ email });
    const otp = generateOTP();

    const transporter = createTransporter();

    if (existingPending) {
      existingPending.otp = otp;
      existingPending.createdAt = Date.now();
      await existingPending.save();

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "✅ Verify Your Healora Account",
        html: `<p>Your new OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p><p>Click <a href="${process.env.FRONTEND_URL}/verify">here</a> to verify.</p>`,
      });

      console.log("📧 [Auth] Registration Email sent:", info.response);
      return res.status(200).json({ message: "A new OTP has been sent to your email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const pendingUser = new PendingUser({ firstName, lastName, email, password: hashedPassword, otp });
    await pendingUser.save();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "✅ Verify Your Healora Account",
      html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p><p>Click <a href="${process.env.FRONTEND_URL}/verify">here</a> to verify.</p>`,
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

  try {
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
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
      html: `<p>Your new OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p><p>Click <a href="${process.env.FRONTEND_URL}/verify">here</a> to verify.</p>`,
    });

    console.log("📧 [Auth] Resend OTP Email sent:", info.response);
    res.status(200).json({ message: "OTP resent to your email" });
  } catch (error) {
    console.error("❌ [Auth] Resend OTP error:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      return res.status(400).json({ error: "No pending registration found" });
    }

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    if (pendingUser.createdAt < tenMinutesAgo) {
      await PendingUser.deleteOne({ email });
      return res.status(400).json({ error: "OTP has expired. Please register again" });
    }

    if (otp.toString().trim() !== pendingUser.otp.toString()) {
      return res.status(400).json({ error: "Invalid OTP. Please try again" });
    }

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

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

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

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email not found" });
    }

    await PasswordReset.deleteOne({ email }); // remove existing if any

    const otp = generateOTP();
    const passwordReset = new PasswordReset({ email, otp });
    await passwordReset.save();

    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "✅ Reset Your Healora Password",
      html: `<p>Your OTP to reset your password is <strong>${otp}</strong>. It is valid for 10 minutes.</p><p>Click <a href="${process.env.FRONTEND_URL}/reset">here</a> to reset.</p>`,
    });

    console.log("📧 [Auth] Forgot Password Email sent:", info.response);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("❌ [Auth] Forgot password error:", error.message, error.stack);
    res.status(500).json({ error: "Failed to send OTP. Please try again" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const passwordReset = await PasswordReset.findOne({ email });
    if (!passwordReset || passwordReset.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    if (passwordReset.createdAt < tenMinutesAgo) {
      await PasswordReset.deleteOne({ email });
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await PasswordReset.deleteOne({ email });

    res.status(200).json({ success: true, message: "Password Reset Successful" });
  } catch (error) {
    console.error("❌ [Auth] Reset password error:", error.message, error.stack);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
});

module.exports = router;
