// server.js or formRoutes.js
const express = require('express');
const { Form, saveForm, updateForm } = require('../models/formModels');
const router = express.Router();

// Route to fetch all forms
router.get('/forms/all', async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (err) {
    console.error('Error fetching forms:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to fetch a form by ID
router.get('/forms/:id', async (req, res) => {
  try {
    const formId = req.params.id;
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json(form);
  } catch (err) {
    console.error('Error fetching form:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/forms', async (req, res) => {
  const formData = req.body;

  // Validate the form data
  if (!formData.title || !formData.fields || !Array.isArray(formData.fields)) {
    return res.status(400).json({ error: 'Invalid form data' });
  }

  try {
    // Save the form data to the database
    const savedForm = await saveForm(formData);
    res.status(200).json(savedForm);
  } catch (error) {
    console.error('Error saving form on backend:', error);
    res.status(500).json({ error: 'An error occurred while saving the form', formData });
  }
});

router.put('/forms/:id', async (req, res) => {
  try {
    const updatedForm = {
      title: req.body.title,
      fields: req.body.fields,
    };

    const formId = req.params.id;
    const updatedDoc = updateForm(formId, updatedForm)

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json(updatedDoc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update form' });
  }
});

module.exports = router;