const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: false
  },
  bio: {
    type: String,
    required: false
  },
  companyName: {
    type: String,
    required: false
  },
  avatarUrl: {
    type: String,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
