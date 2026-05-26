const express = require('express');
const router = express.Router();

// Placeholder for general auth routes
// Most auth functionality is in ambassadors.js

router.get('/check', (req, res) => {
  res.json({ message: 'Auth server is running' });
});

module.exports = router;
