const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Serve static files from frontend build
const buildPath = path.join(__dirname, 'frontend', 'build');

if (fs.existsSync(buildPath)) {
  console.log('Serving from build directory:', buildPath);
  app.use(express.static(buildPath));
  
  // Handle React routing - return index.html for all routes
  app.get('*', (req, res) => {
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Index file not found');
    }
  });
} else {
  console.log('Build directory not found:', buildPath);
  res.status(500).send('Build directory not found. Please run npm run build first.');
}

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to access the application`);
});

// Handle server errors
app.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
  } else {
    console.error('Server error:', err);
  }
});
