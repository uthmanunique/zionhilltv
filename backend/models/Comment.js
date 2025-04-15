const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  time: { type: String },
  reportedReason: { type: String },
});

module.exports = mongoose.model('Comment', commentSchema);