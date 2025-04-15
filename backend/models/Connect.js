const mongoose = require('mongoose');

const connectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  groupName: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Connect', connectSchema);