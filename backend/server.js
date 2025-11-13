const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const serviceRoutes = require('./routes/services');
const settingsRoutes = require('./routes/settings');
const enrollmentRoutes = require('./routes/enrollments');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.log('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ✅ CORS middleware
const allowedOrigins = [
  'https://victoe-and-sons.vercel.app', 
  'http://localhost:3000', 
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Preflight handling for all routes
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ JSON parsing middleware
app.use(express.json());

// ✅ Test routes
app.get('/', (req, res) => res.send('✅ Backend is running!'));
app.get('/api/test', (req, res) => res.json({ message: '✅ API test successful!' }));

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/bookings', bookingRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
