const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Support = require('../models/Support');

// @route   POST api/support
// @desc    Submit a support request
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { type, subject, message } = req.body;

    const newSupport = new Support({
      user: req.user.id,
      type,
      subject,
      message
    });

    const support = await newSupport.save();
    res.json(support);
  } catch (err) {
    console.error(err.message);
      res.status(500).json({ message: "Server error" });
  }
});

// @route   GET api/support
// @desc    Get user's support requests
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const supports = await Support.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(supports);
  } catch (err) {
    console.error(err.message);
      res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
