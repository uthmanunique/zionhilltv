const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const PraiseReport = require('../models/PraiseReport');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// POST /api/praise-report - Submit praise report with media
router.post('/', upload.single('media'), async (req, res) => {
  const { name, phone, report } = req.body;
  const media = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    if (!media) throw new Error('Media upload failed');
    const praiseReport = new PraiseReport({ name, phone, media, report });
    await praiseReport.save();
    res.status(201).json({ message: 'Praise report submitted successfully', praiseReport });
  } catch (err) {
    console.error('Praise report save error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/praise-report - Fetch all praise reports
router.get('/', async (req, res) => {
  try {
    const reports = await PraiseReport.find();
    res.json(reports);
  } catch (err) {
    console.error('Praise report fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;