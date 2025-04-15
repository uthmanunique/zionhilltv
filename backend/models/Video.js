const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  image: { type: String },
  section: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  reactions: [{
    userId: { type: String, required: true },
    type: { type: String, enum: ['like', 'dislike'], required: true },
  }],
  comments: [{
    user: { type: String },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
}, { minimize: false }); // Ensures empty arrays are saved

module.exports = mongoose.model('Video', videoSchema);