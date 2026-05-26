const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`Frontend server running on port ${port}`);
});
