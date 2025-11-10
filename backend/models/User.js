const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "This is my bio!",
  },
  // 👇 ADD THIS FIELD 👇
  headline: {
    type: String,
    default: "New User",
  }
});

module.exports = mongoose.model('User', UserSchema);