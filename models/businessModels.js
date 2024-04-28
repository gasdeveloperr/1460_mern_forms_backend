const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  primary_contact: {
    type: String,
    required: true,
  },
  contact_email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  users:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

const Business = mongoose.model('Business', businessSchema);


const saveBusiness = async (businessData) => {
  const business = new Business(businessData);
  const savedBusiness = await business.save();
  return savedBusiness;
};

const addNewUserToBusiness = async (businessId, newUser) => {
  try {
    await Business.findByIdAndUpdate(
      businessId,
      { $push: { users: newUser } },
      { new: true }
    );
  } catch (err) {
    console.error('Error adding new user to business:', err);
    throw err;
  }
};


module.exports = {
  Business,
  saveBusiness,
  addNewUserToBusiness
};