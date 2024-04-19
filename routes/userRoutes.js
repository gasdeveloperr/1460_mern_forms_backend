const express = require('express');
const { User, saveUser, updateUser } = require('../models/userModels');
const router = express.Router();

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
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/new', async (req, res) => {

  try {
    // Create a new user document
    const newUser = new User({
      title: 'New user',
      fields: [],
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(200).json(savedUser);
  } catch (error) {
    console.error('Error saving user on backend:', error);
    res.status(500).json({ error: 'An error occurred while saving the user' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedUser = {
      title: req.body.title,
      fields: req.body.fields,
    };

    const userId = req.params.id;
    const updatedDoc = updateUser(userId, updatedUser)

    if (!updatedDoc) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedDoc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
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