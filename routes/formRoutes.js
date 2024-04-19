// server.js or formRoutes.js
const express = require('express');
const { Form, saveForm, updateForm } = require('../models/formModels');
const router = express.Router();

// Route to fetch all forms
router.get('/all', async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (err) {
    console.error('Error fetching forms:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to fetch a form by ID
router.get('/:id', async (req, res) => {
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

// Route to delete a form by ID
router.delete('/:id', async (req, res) => {
  try {
    const formId = req.params.id;
    
    // Find the form by ID and remove it from the database
    const deletedForm = await Form.findByIdAndDelete(formId);
    
    if (!deletedForm) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    res.json({ message: 'Form deleted successfully' });
  } catch (err) {
    console.error('Error deleting form:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/new', async (req, res) => {

  const timeLog = new Date()
  console.log('created new form : ', timeLog)

  try {
    // Create a new form document
    const newForm = new Form({
      title: req.body.title,
      fields: req.body.fields,
    });

    // Save the form to the database
    const savedForm = await newForm.save();

    res.status(200).json(savedForm);
  } catch (error) {
    console.error('Error saving form on backend:', error);
    res.status(500).json({ error: 'An error occurred while saving the form' });
  }
});

router.put('/:id', async (req, res) => {
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