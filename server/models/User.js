const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'],
  },
  password: { type: String, required: true, minlength: [6, 'Password must be at least 6 characters'] },
  phone: { type: String, default: '' },
  gender: { type: String, default: '' },
  dateOfBirth: { type: String, default: '' },
  location: { type: String, default: '' },
  bloodType: { type: String, default: '' },
  chronicConditions: { type: [String], default: [] },
  allergies: { type: [String], default: [] },
  recentQueries: [{ prompt: String, response: String }],
  savedMedicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
  appointments: [{ type: String }],
}, {
  timestamps: true
});

// Hash password if not already hashed
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.password.startsWith('$2b$')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Email already registered'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
