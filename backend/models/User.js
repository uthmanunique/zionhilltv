const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Added
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' }, // Added
  joined: { type: Date, default: Date.now }, // Added
  role: { type: String, enum: ['Admin', 'Moderator', 'User'], default: 'User' }, // Added
});

module.exports = mongoose.model('User', userSchema);