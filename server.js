const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const activateUserRoutes = require('./routes/activateUserRoutes');
const formRoutes = require('./routes/formRoutes');
const submsnFormRoutes = require('./routes/submsnFormRoutes');
const businessRoutes = require('./routes/businessRoutes');

const authMiddleware = require('./middlewares/authMiddleware');
const roleMiddleware = require('./middlewares/roleMiddleware');

const dotenv = require("dotenv")
dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;
const secretKey = process.env.JWT_SECRET;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(`mongodb+srv://gasdev486:${process.env.MONDODB_PASSWORD}@simmons.8zs9dij.mongodb.net/?retryWrites=true&w=majority&appName=simmons`, {})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activate', activateUserRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/forms', authMiddleware, formRoutes);
app.use('/api/subm_forms', authMiddleware, submsnFormRoutes);
app.use('/api/business', authMiddleware, businessRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});