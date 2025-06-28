import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/map-key', (req, res) => {
  res.json({ key: process.env.GOOGLE_MAPS_API_KEY });
});

export default router;