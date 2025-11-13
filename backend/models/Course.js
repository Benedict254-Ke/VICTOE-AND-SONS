const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    min: 0
  },
  fee_ksh: {
    type: Number,
    min: 0
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['basic', 'advanced', 'professional'],
    default: 'basic'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);