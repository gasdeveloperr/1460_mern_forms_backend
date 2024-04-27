// server.js or businessRoutes.js
const express = require('express');
const { Business, saveBusiness, updateBusiness } = require('../models/businessModels');
const router = express.Router();

// Route to fetch all businesss
router.get('/all', async (req, res) => {
  try {
    const businesss = await Business.find();
    res.json(businesss);
  } catch (err) {
    console.error('Error fetching businesss:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to fetch a business by ID
router.get('/:id', async (req, res) => {
  try {
    const businessId = req.params.id;
    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json(business);
  } catch (err) {
    console.error('Error fetching business:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to delete a business by ID
router.delete('/:id', async (req, res) => {
  try {
    const businessId = req.params.id;
    
    // Find the business by ID and remove it from the database
    const deletedBusiness = await Business.findByIdAndDelete(businessId);
    
    if (!deletedBusiness) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    res.json({ message: 'Business deleted successfully' });
  } catch (err) {
    console.error('Error deleting business:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/new', async (req, res) => {

  try {
    const newBusiness = new Business({
      name: req.body.name,
      address: req.body.address, 
      zip: req.body.zip,
      phone: req.body.phone,
      primary_contact: req.body.primary_contact,
      contact_email: req.body.contact_email,
      description: req.body.description
    });

    const savedBusiness = await newBusiness.save();

    res.status(200).json(savedBusiness);
  } catch (error) {
    console.error('Error saving business on backend:', error);
    res.status(500).json({ error: 'An error occurred while saving the business' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedBusiness = {
      title: req.body.title,
      fields: req.body.fields,
    };

    const businessId = req.params.id;
    const updatedDoc = updateBusiness(businessId, updatedBusiness)

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json(updatedDoc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update business' });
  }
});

module.exports = router;