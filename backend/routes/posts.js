const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import our auth middleware
const Post = require('../models/Post');
const User = require('../models/User');

// --- GET ALL POSTS ROUTE ---
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', ['name']) // Get user's name
      .sort({ createdAt: -1 }); // Newest first
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- CREATE POST ROUTE ---
// @route   POST /api/posts
// @access  Private (notice the 'auth' middleware)
router.post('/', auth, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ msg: 'Post text is required' });
  }

  try {
    const newPost = new Post({
      text: text,
      user: req.user.id, // We get this from the 'auth' middleware
    });

    const post = await newPost.save();
    
    // We need to populate the user data for the post we just created
    // before sending it back to the frontend
    const populatedPost = await Post.findById(post._id).populate('user', ['name']);
    
    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;