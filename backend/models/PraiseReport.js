const mongoose = require('mongoose');

const praiseReportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  media: { type: String, required: true }, // Path to uploaded file
  report: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PraiseReport', praiseReportSchema);