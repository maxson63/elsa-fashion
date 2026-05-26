const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

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

// Serve static files from frontend build or public
const buildPath = path.join(__dirname, 'frontend', 'build');
const publicPath = path.join(__dirname, 'frontend', 'public');

if (fs.existsSync(buildPath)) {
  console.log('Serving from build directory');
  app.use(express.static(buildPath));
  
  // Handle React routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  console.log('Serving from public directory');
  app.use(express.static(publicPath));
  
  // Handle React routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to access the application`);
});
