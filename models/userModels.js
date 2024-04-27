const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  business:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business'
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'editor', 'contributor'],
    default: 'user',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = {User};