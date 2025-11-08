const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // A reference to a User's ID
    ref: 'User', // Links this to the 'User' model
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the time
  },
});

module.exports = mongoose.model('Post', PostSchema);