const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const authMiddleware = require('../middleware/auth');

router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    const userId = req.headers['user-id'];
    const userReaction = video.reactions?.find(r => r.userId === userId)?.type || null;
    res.json({ ...video.toJSON(), userReaction });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user.id; // From authMiddleware
    const existingReaction = video.reactions.find(r => r.userId === userId);

    if (existingReaction) {
      if (existingReaction.type === 'like') {
        video.reactions = video.reactions.filter(r => r.userId !== userId);
        video.likes -= 1;
      } else if (existingReaction.type === 'dislike') {
        existingReaction.type = 'like';
        video.likes += 1;
        video.dislikes -= 1;
      }
    } else {
      video.reactions.push({ userId, type: 'like' });
      video.likes += 1;
    }

    await video.save();
    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/dislike', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user.id;
    const existingReaction = video.reactions.find(r => r.userId === userId);

    if (existingReaction) {
      if (existingReaction.type === 'dislike') {
        video.reactions = video.reactions.filter(r => r.userId !== userId);
        video.dislikes -= 1;
      } else if (existingReaction.type === 'like') {
        existingReaction.type = 'dislike';
        video.dislikes += 1;
        video.likes -= 1;
      }
    } else {
      video.reactions.push({ userId, type: 'dislike' });
      video.dislikes += 1;
    }

    await video.save();
    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    console.error('Dislike error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/:id/comments', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video.comments || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/comments', async (req, res) => {
  const { text, userId } = req.body;
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    
    // Ensure comments is an array
    if (!Array.isArray(video.comments)) {
      video.comments = [];
    }
    
    const comment = { user: userId, text, createdAt: new Date() };
    video.comments.push(comment);
    await video.save();
    res.status(201).json(comment);
  } catch (err) {
    console.error('Comment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;