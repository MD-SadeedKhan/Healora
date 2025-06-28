const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '10m' }, // OTP expires after 10 minutes
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);