const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const Comment = require('../models/Comment');
const Reaction = require('../models/Reaction');
const User = require('../models/User');
const Setting = require('../models/Setting');
const Activity = require('../models/Activity');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.use(authMiddleware);
router.use(adminMiddleware);

// Stats
router.get('/stats', async (req, res) => {
  try {
    const totalVideos = await Video.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalReactions = await Reaction.countDocuments();
    const recentActivity = await Activity.find().sort({ timestamp: -1 }).limit(5);
    const topVideo = await Video.findOne().sort({ views: -1 });
    res.json({
      totalVideos,
      totalLiveViewers: 150, // Placeholder until live feature
      totalCommentsReactions: totalComments + totalReactions,
      topVideo: topVideo?.title || 'N/A',
      recentActivity: recentActivity.map(a => ({
        time: a.timestamp,
        type: a.action.split(' ')[0], // e.g., "Video" from "Video uploaded"
        action: a.action,
      })),
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    console.log('Videos fetched:', videos); // Debug
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/videos', upload.fields([{ name: 'videoFile' }, { name: 'thumbnail' }]), async (req, res) => {
  try {
    const { title, description, category, visibility, tags } = req.body;
    const videoFile = req.files['videoFile']?.[0];
    const thumbnail = req.files['thumbnail']?.[0];
    if (!videoFile) throw new Error('No video file uploaded');

    const video = new Video({
      title,
      description,
      section: category,
      visibility,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      url: videoFile ? `/uploads/${videoFile.filename}` : '', // Fixed field name
      image: thumbnail ? `/uploads/${thumbnail.filename}` : '',
      status: 'Pending', // Starts in queue
    });
    const savedVideo = await video.save();
    await new Activity({ admin: req.user.username, action: `Video uploaded: ${title}` }).save();
    res.status(201).json(savedVideo);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.patch('/videos/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    Object.assign(video, req.body); // Update status for queue
    await video.save();
    await new Activity({ admin: req.user.username, action: `Video ${req.body.status || 'updated'}: ${video.title}` }).save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/videos/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    await new Activity({ admin: req.user.username, action: `Video deleted: ${video.title}` }).save();
    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Comments
router.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/comments/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    await new Activity({ admin: req.user.username, action: 'Comment deleted' }).save();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reactions
router.get('/reactions', async (req, res) => {
  try {
    const reactions = await Reaction.find();
    res.json(reactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/reactions/:id', async (req, res) => {
  try {
    const reaction = await Reaction.findByIdAndDelete(req.params.id);
    if (!reaction) return res.status(404).json({ message: 'Reaction not found' });
    await new Activity({ admin: req.user.username, action: 'Reaction deleted' }).save();
    res.json({ message: 'Reaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = req.body.status || user.status;
    await user.save();
    await new Activity({ admin: req.user.username, action: `User ${user.status}ed: ${user.username}` }).save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Settings
router.get('/settings', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) settings = await new Setting().save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/settings', async (req, res) => {
  try {
    const settings = await Setting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    await new Activity({ admin: req.user.username, action: 'Settings updated' }).save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Analytics
router.get('/analytics', async (req, res) => {
  try {
    const totalVideos = await Video.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalReactions = await Reaction.countDocuments();
    const recentActivity = await Activity.find().sort({ timestamp: -1 }).limit(5);
    const topVideo = await Video.findOne().sort({ views: -1 });
    const engagement = [
      { day: 'Mon', viewers: 120 },
      // ... placeholder data
    ];
    const reactions = await Reaction.aggregate([
      { $group: { _id: '$reaction', count: { $sum: 1 } } },
      { $project: { type: '$_id', count: 1, _id: 0 } },
    ]);
    const videoPerformance = await Video.find().select('title views likes comments');
    res.json({
      totalVideos,
      totalLiveViewers: 150, // Placeholder
      totalCommentsReactions: totalComments + totalReactions,
      topVideo: topVideo?.title || 'N/A',
      recentActivity: recentActivity.map(a => ({
        time: a.timestamp,
        type: a.action.split(' ')[0],
        action: a.action,
      })),
      engagement,
      reactions: reactions.length ? reactions : [{ type: 'Likes', count: 50 }, { type: 'Dislikes', count: 10 }, { type: 'Loves', count: 30 }, { type: 'Laughs', count: 20 }],
      videoPerformance,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;