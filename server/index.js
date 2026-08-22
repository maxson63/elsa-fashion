const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const ambassadorRoutes = require('./routes/ambassadors');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const localPaymentRoutes = require('./routes/payments-local');
const clearanceStorageRoutes = require('./routes/clearance-storage');
const profileRoutes = require('./routes/profile');
const checkoutRoutes = require('./routes/checkout');
const userRoutes = require('./routes/users');

// Initialize Google OAuth
require('./config/google');

const app = express();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elsa-fashion';
console.log('Connecting to MongoDB with URI:', MONGODB_URI);
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Make sure your MONGODB_URI is set correctly in .env file');
  });

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', /.+\.vercel\.app$/, /.+\.netlify\.app$/],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === '/health';
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Session middleware for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Mock products data for testing
const mockProducts = [
  {
    _id: '1',
    name: 'Elegant Fashion Piece',
    description: 'Discover elegant luxury with this fashion masterpiece that embodies the essence of sophisticated style. Expertly crafted with premium materials and meticulous attention to detail, this versatile creation offers the perfect balance between contemporary trends and timeless elegance.',
    price: 380.00,
    image: "https://tse1.mm.bing.net/th/id/OIP.VRWhcQQw-ZHqvfJCLniMBAHaNL?pid=ImgDet&w=600&h=600&c=7&o=7&rm=3",
    category: 'casual',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
    colors: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink'],
    inStock: true,
    featured: false,
    createdAt: new Date()
  },
  {
    _id: '2',
    name: 'Chic Fashion Accessory',
    description: 'Experience chic luxury with this fashion accessory that embodies the essence of modern elegance. Expertly crafted with premium materials and meticulous attention to detail, this versatile piece offers the perfect balance between contemporary trends and timeless sophistication.',
    price: 310.00,
    image: "https://tse2.mm.bing.net/th/id/OIP.P8s6PuAogxgs3o_IjSI11wHaKo?pid=ImgDet&w=600&h=600&c=7&o=7&rm=3",
    category: 'formal',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
    colors: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink'],
    inStock: true,
    featured: false,
    createdAt: new Date()
  }
];

// Health check endpoint for keep-alive services
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ambassadors', ambassadorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/payments-local', localPaymentRoutes);
app.use('/api/clearance-storage', clearanceStorageRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/users', userRoutes);

// Google OAuth Routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed` }),
  async (req, res) => {
    try {
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { ambassadorId: req.user._id, email: req.user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
      
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/ambassador/dashboard?token=${token}`);
    } catch (error) {
      console.error('Error generating token after Google auth:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=token_generation_failed`);
    }
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
