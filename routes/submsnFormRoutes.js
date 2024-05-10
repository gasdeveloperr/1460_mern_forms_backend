// server.js or formRoutes.js
const express = require('express');
const { SubmissionForm} = require('../models/formModels');
const router = express.Router();

// Route to fetch all forms
router.get('/all', async (req, res) => {
  try {
    const subm_forms = await SubmissionForm.find();
    res.json(subm_forms);
  } catch (err) {
    console.error('Error fetching submitted forms:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to fetch a form by ID
router.get('/:id', async (req, res) => {
  try {
    const submFormId = req.params.id;
    const subm_form = await SubmissionForm.findById(submFormId);

    if (!subm_form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json(subm_form);
  } catch (err) {
    console.error('Error fetching form:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id', async (req, res) => {
  try {
    const newSubForm = new SubmissionForm({
      formId: req.params.id,
      data: req.body.formData,
    });

    const savedForm = await newSubForm.save();

    res.status(200).json(savedForm);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

module.exports = router;