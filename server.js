const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const formRoutes = require('./routes/formRoutes');
const submsnFormRoutes = require('./routes/submsnFormRoutes');
const dotenv = require("dotenv")
dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(`mongodb+srv://gasdev486:${process.env.MONDODB_PASSWORD}@simmons.8zs9dij.mongodb.net/?retryWrites=true&w=majority&appName=simmons`, {})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/subm_forms', submsnFormRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});