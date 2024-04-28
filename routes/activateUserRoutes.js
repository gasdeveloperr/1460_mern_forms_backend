const express = require('express');
const { User } = require('../models/userModels');
const router = express.Router();

// Activation API endpoint
router.post('/:token', async(req, res) => {
  const userActivateToken = req.params.token;

  try {
    // Find the user by invitationLink token
    const user = await User.findOne({ invitationLink: userActivateToken });

    if (!user) {
      return res.status(400).json({ message: 'Invalid activation token' });
    }

    // Check if the user is already activated
    if (user.invitationLink === 'activated') {
      return res.status(400).json({ message: 'User already activated' });
    }

    // Update the user's invitationLink to 'activated'
    user.invitationLink = 'activated';
    await user.save();

    res.status(200).json({ message: 'Account activated successfully' });
  } catch (error) {
    console.error('Error activating account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;