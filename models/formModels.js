const mongoose = require('mongoose');

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
    console.error('Error updating form:', err);
    throw err;
  }
};

module.exports = {
  Form,
  saveForm,
  updateForm
};