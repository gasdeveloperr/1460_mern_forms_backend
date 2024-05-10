const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  data: {
    type: Object,
    required: true,
  },
});

const SubmissionForm = mongoose.model('SubmissionForm', submissionSchema);

const formSchema = new mongoose.Schema({
  title: String,
  fields: [],
});

const Form = mongoose.model('Form', formSchema);

const saveForm = async (formData) => {
  const form = new Form(formData);
  const savedForm = await form.save();
  return savedForm;
};

const updateForm = async (formId, updatedForm) => {
  try {
    const updatedDoc = await Form.findByIdAndUpdate(
      formId,
      { title: updatedForm.title, fields: updatedForm.fields },
      { new: true }
    );
    return updatedDoc;
  } catch (err) {
    console.error('Error updating form in db models:', err);
    throw err;
  }
};

module.exports = {
  SubmissionForm,
  Form,
  saveForm,
  updateForm
};