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

module.exports = router;