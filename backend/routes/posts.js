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
// ... (at the end of the file, before module.exports)

// --- GET POSTS BY USER ID ---
// @route   GET /api/posts/user/:userId
// @desc    Get all posts from a specific user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', ['name'])
      .sort({ createdAt: -1 });
    
    if (!posts) {
      return res.status(404).json({ msg: 'No posts found for this user' });
    }

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

// --- DELETE A POST ---
// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // **Check if user owns the post**
    // We use .toString() to match the 'user' (ObjectId) with the 'req.user.id' (String)
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Use remove() or deleteOne()
    // Use deleteOne()
await post.deleteOne();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;