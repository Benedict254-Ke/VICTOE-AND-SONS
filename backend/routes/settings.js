const express = require('express');
const Settings = require('../models/Settings');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get setting by key
router.get('/:key', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.json({ key: setting.key, value: setting.value, type: setting.type });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update setting (admin only)
router.put('/:key', adminAuth, async (req, res) => {
  try {
    const { value, type = 'string' } = req.body;
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value, type },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete setting (admin only)
router.delete('/:key', adminAuth, async (req, res) => {
  try {
    const setting = await Settings.findOneAndDelete({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;