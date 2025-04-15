const express = require('express');
const router = express.Router();
const Partnership = require('../models/Partnership');

// POST /api/partnership - Submit partnership request
router.post('/', async (req, res) => {
  const { name, phone, email, notes } = req.body;
  try {
    const partnership = new Partnership({ name, phone, email, notes });
    await partnership.save();
    res.status(201).json({ message: 'Partnership request submitted successfully' });
  } catch (err) {
    console.error('Partnership save error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/partnership - Fetch all requests (optional, for later admin use)
router.get('/', async (req, res) => {
  try {
    const partnerships = await Partnership.find();
    res.json(partnerships);
  } catch (err) {
    console.error('Partnership fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;