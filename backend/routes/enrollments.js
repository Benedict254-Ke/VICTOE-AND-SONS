const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all enrollments (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create enrollment (public)
router.post('/', async (req, res) => {
  try {
    const { courseId, studentName, email, phone, notes } = req.body;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      courseId,
      courseTitle: course.title,
      studentName,
      email,
      phone,
      notes
    });

    await enrollment.save();

    res.status(201).json({
      message: 'Enrollment submitted successfully!',
      enrollment: {
        id: enrollment._id,
        courseTitle: enrollment.courseTitle,
        status: enrollment.status
      }
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update enrollment status (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete enrollment (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;