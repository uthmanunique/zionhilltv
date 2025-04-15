const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  admin: { type: String }, // Admin username
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', activitySchema);