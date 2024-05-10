const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    //required: true,
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
  status: {
    type: String,
    //required: true,
  },
  invitationLink: {
    type: String,
    //required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = {User};