const express = require('express');
const router = express.Router();

// Dummy hospital data generator
const generateDummyHospitals = (lat, lng) => {
  return [
    {
      place_id: "dummy1",
      name: "City Hospital",
      lat: lat + 0.01,
      lng: lng + 0.01,
      rating: 4.2,
      vicinity: "12th Main, Bangalore",
      photos: [],
      specialties: ['General', 'Emergency']
    },
    {
      place_id: "dummy2",
      name: "Green Life Medical Center",
      lat: lat - 0.01,
      lng: lng - 0.01,
      rating: 3.9,
      vicinity: "5th Cross, MG Road",
      photos: [],
      specialties: ['Cardiology', 'Emergency']
    },
    {
      place_id: "dummy3",
      name: "Sunshine Hospital",
      lat: lat + 0.008,
      lng: lng - 0.012,
      rating: 4.5,
      vicinity: "BTM Layout, Bangalore",
      photos: [],
      specialties: ['Orthopedics', 'Pediatrics']
    },
    {
      place_id: "dummy4",
      name: "WellCare Clinic",
      lat: lat - 0.009,
      lng: lng + 0.01,
      rating: 4.0,
      vicinity: "HSR Layout, Bangalore",
      photos: [],
      specialties: ['General', 'Gynecology']
    },
    {
      place_id: "dummy5",
      name: "Apollo Diagnostics",
      lat: lat + 0.005,
      lng: lng + 0.005,
      rating: 4.3,
      vicinity: "Indiranagar, Bangalore",
      photos: [],
      specialties: ['Diagnostic', 'Emergency']
    }
  ];
};

// GET /api/hospitals?lat=...&lng=...
router.get('/', (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const dummyHospitals = generateDummyHospitals(parseFloat(lat), parseFloat(lng));
  res.json(dummyHospitals);
});

module.exports = router;
