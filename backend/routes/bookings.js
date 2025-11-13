const express = require('express');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all bookings (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('service').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create booking (public)
router.post('/', async (req, res) => {
  try {
    const { fullName, phoneNumber, service, preferredDate, additionalNotes } = req.body;

    // Verify service exists
    const serviceDoc = await Service.findById(service);
    if (!serviceDoc) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Create booking
    const booking = new Booking({
      fullName,
      phoneNumber,
      service,
      serviceName: serviceDoc.title,
      preferredDate,
      additionalNotes
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking submitted successfully! We\'ll confirm your appointment within 2 hours.',
      booking: {
        id: booking._id,
        serviceName: booking.serviceName,
        status: booking.status,
        preferredDate: booking.preferredDate
      }
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('service');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete booking (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;