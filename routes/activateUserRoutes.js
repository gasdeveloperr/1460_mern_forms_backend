const express = require('express');
const { User } = require('../models/userModels');
const router = express.Router();
const bcrypt = require('bcrypt');


// Activation API endpoint
router.get('/:token', async(req, res) => {
  const userActivateToken = req.params.token;

  try {
    // Find the user by invitationLink token
    const user = await User.findOne({ invitationLink: userActivateToken });

    if (!user) {
      return res.status(400).json({ message: 'Invalid activation token' });
    }

    // Check if the user is already activated
    if (user.status === 'activated') {
      res.status(200).json({ message: 'User already activated' });
    } else{
      return res.status(400).json({ message: 'Account is not active yet' });
    }

  } catch (error) {
    console.error('Error activating account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Activation API endpoint
router.post('/:token', async(req, res) => {
  const userActivateToken = req.params.token;
  const newPassword= await bcrypt.hash(req.body.password, 10);

  try {
    // Find the user by invitationLink token
    const user = await User.findOne({ invitationLink: userActivateToken });

    if (!user) {
      return res.status(400).json({ message: 'Invalid activation token' });
    }

    // Check if the user is already activated
    if (user.status === 'activated') {
      return res.status(400).json({ message: 'User already activated' });
    } 

    user.password = newPassword;
    user.status = 'activated';
    await user.save();

    res.status(200).json({ message: 'Account activated successfully' });
  } catch (error) {
    console.error('Error activating account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;