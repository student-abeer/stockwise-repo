const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// @route   GET api/activity
// @desc    Get all activity logs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', ['name', 'email'])
      .sort({ date: -1 })
      .limit(50);
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
