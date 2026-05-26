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

// Simple products data
const products = [
  {
    id: 1,
    name: "Elegant Evening Gown",
    price: 700,
    description: "Stunning evening gown",
    image: "https://tse1.mm.bing.net/th/id/OIP.pMl9VILFptjMmTzbVjRk5wHaKX?pid=ImgDet&w=474&h=663&rs=1&o=7&rm=3",
    category: "Clothing",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy"]
  },
  {
    id: 2,
    name: "Classic Handbag",
    price: 300,
    description: "Elegant leather handbag",
    image: "https://tse1.mm.bing.net/th/id/OIP.pMl9VILFptjMmTzbVjRk5wHaKX?pid=ImgDet&w=474&h=663&rs=1&o=7&rm=3",
    category: "Accessories",
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tan"]
  }
];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Elsa Fashion API Server - Simplified' });
});

app.get('/api/products', (req, res) => {
  console.log('GET /api/products - returning products');
  res.json(products);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = 5002;
const server = app.listen(PORT, () => {
  console.log(`✅ Simplified Server running on port ${PORT}`);
  console.log(`✅ API available at http://localhost:${PORT}/api/products`);
  console.log(`✅ Health check at http://localhost:${PORT}/api/health`);
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
