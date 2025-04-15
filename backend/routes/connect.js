const express = require('express');
const router = express.Router();
const Connect = require('../models/Connect');

// POST /api/connect/join - Submit join request
router.post('/join', async (req, res) => {
  const { name, phone, groupName, address } = req.body;
  try {
    const connect = new Connect({ name, phone, groupName, address });
    await connect.save();
    res.status(201).json({ message: 'Join request submitted successfully' });
  } catch (err) {
    console.error('Connect save error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/connect/groups - Fetch connect groups (static for now)
router.get('/groups', (req, res) => {
  const groups = [
    { name: 'Youth Group', activities: 'Bible study, outings' },
    { name: 'Prayer Circle', activities: 'Weekly prayers' },
    { name: 'Community Outreach', activities: 'Volunteering' },
  ];
  res.json(groups);
});

module.exports = router;