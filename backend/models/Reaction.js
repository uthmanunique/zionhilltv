const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  reaction: { type: String, required: true },
  date: { type: Date, default: Date.now },
  time: { type: String },
});

module.exports = mongoose.model('Reaction', reactionSchema);