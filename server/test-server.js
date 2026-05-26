const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is working!', timestamp: new Date() });
});

// Auth test route
app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth endpoint working!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}/api/test`);
});
