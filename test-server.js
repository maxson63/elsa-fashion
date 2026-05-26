const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Test Server Running' });
});

// Test products route
app.get('/api/products', (req, res) => {
  res.json([
    {
      id: 1,
      name: "Test Product",
      price: 100,
      description: "Test Description",
      image: "https://example.com/image.jpg",
      category: "Clothing",
      sizes: ["S", "M", "L"],
      colors: ["Black", "White"]
    }
  ]);
});

const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`✅ Test Server running on port ${PORT}`);
  console.log(`✅ API available at http://localhost:${PORT}/api/products`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
