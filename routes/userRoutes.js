const express = require('express');
const { User} = require('../models/userModels');
const { addNewUserToBusiness, Business } = require('../models/businessModels');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

function generateUniqueToken() {
  const token = crypto.randomBytes(20).toString('hex');
  return token;
}

// Route to fetch all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to fetch a user by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find the user by ID and remove it from the database
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    await Business.updateMany(
      { users: userId },
      { $pull: { users: userId } }
    );
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/new', async (req, res) => {

  try {
    const newUser = new User({
      email: req.body.email,
      name: req.body.name,
      role: req.body.role,
      business: req.body.business,
      password: req.body.password,
      status: 'inactive'
    });

    const savedUser = await newUser.save();

    const businessId = savedUser.business;
    addNewUserToBusiness(businessId, savedUser._id)

    res.status(200).json(savedUser);
  } catch (error) {
    console.error('Error saving user on backend:', error);
    res.status(500).json({ error: 'An error occurred while saving the user' });
  }
});

router.post('/change-name', async (req, res) => {
  try {
    const userId= req.body.id;
    const newName= req.body.name;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name: newName },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
    //.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.post('/change-password', async (req, res) => {
  try {
    const userId= req.body.id;
    const newPassword= await bcrypt.hash(req.body.password, 10);;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
    //.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.post('/invite', async  (req, res) => {

  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique activation token
    const activationToken = generateUniqueToken();

    // Update the user's invitationLink property
    user.invitationLink = activationToken;
    await user.save();

    // Send the invitation email with the activation link
    //await sendInvitationEmail(email, activationToken);

    res.json(activationToken);
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Activation API endpoint
router.post('/activate/:token', async(req, res) => {
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

// Reset password route
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a password reset token (you can use a library like jsonwebtoken)
    const resetToken = generateResetToken(user._id);

    // Save the reset token to the user's document in the database
    user.resetToken = resetToken;
    await user.save();

    // Send the password reset email to the user's email address
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Confirm password reset route
router.post('/confirm-password-reset', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Find the user by the reset token
    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and remove the reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Error confirming password reset:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;