const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  usage: String,
  dosage: String,
  sideEffects: String,
  alternatives: [String],
  tags: [String],
  category: String,
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Medicine', medicineSchema);