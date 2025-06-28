const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// 🧠 Get full user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    res.status(200).json({
      ...user.toObject(),
      name: fullName,
    });
  } catch (error) {
    console.error('[GET /profile] Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✏️ Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const {
      fullName,
      phone,
      gender,
      dateOfBirth,
      location,
      bloodType,
      chronicConditions,
      allergies
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (fullName) {
      const parts = fullName.trim().split(' ');
      user.firstName = parts[0];
      user.lastName = parts.slice(1).join(' ') || '';
    }

    user.phone = phone || user.phone;
    user.gender = gender || user.gender;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.location = location || user.location;
    user.bloodType = bloodType || user.bloodType;
    user.chronicConditions = chronicConditions || user.chronicConditions;
    user.allergies = allergies || user.allergies;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('[PUT /profile] Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
