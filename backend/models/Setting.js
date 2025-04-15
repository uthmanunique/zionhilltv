const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'ZionHill TV' },
  adminEmail: { type: String, default: 'admin@zionhilltv.com' },
  maxUploadSize: { type: Number, default: 100 },
  requireCommentApproval: { type: Boolean, default: false },
  reportThreshold: { type: Number, default: 5 },
  theme: { type: String, default: 'Light' },
  logo: { type: String, default: '/logo.png' },
});

module.exports = mongoose.model('Setting', settingSchema);