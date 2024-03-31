// server.js or formRoutes.js
const express = require('express');
const { SubmissionForm, submitSubmsnForm } = require('../models/formModels');
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
    const submited_form = {
      title: req.body.title,
      fields: req.body.fields,
    };

    const formId = req.params.id;
    const updatedDoc = submitSubmsnForm(formId, submited_form)

    if (!updatedDoc) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json(updatedDoc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update form' });
  }
});

module.exports = router;