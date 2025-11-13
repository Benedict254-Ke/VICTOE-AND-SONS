const express = require('express');
const cors = require('cors');
require('dotenv').config();

const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const serviceRoutes = require('./routes/services');
const settingsRoutes = require('./routes/settings');
const enrollmentRoutes = require('./routes/enrollments');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');

    // Middleware
    app.use(cors({
      origin: ['https://victoe-and-sons.vercel.app/', 'http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(express.json());

    // Routes
    app.get('/', (req, res) => {
      res.send('Backend is running!');
    });

    app.get('/api/test', (req, res) => {
      res.json({ message: 'API is working!' });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/services', serviceRoutes);
    app.use('/api/settings', settingsRoutes);
    app.use('/api/enrollments', enrollmentRoutes);
    app.use('/api/bookings', bookingRoutes);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
    process.exit(1);
  });