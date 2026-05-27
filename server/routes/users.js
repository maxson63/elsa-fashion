const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// MongoDB Schema for User
const UserSchema = new mongoose.Schema({
  _id: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  createdAt: { type: String, default: () => new Date().toISOString() },
  accountType: { type: String, default: 'customer' }
});

const User = mongoose.model('User', UserSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Helper function to generate token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        message: 'Missing required fields: email, password, firstName, lastName' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const userId = `user_${Date.now()}`;
    const newUser = new User({
      _id: userId,
      email,
      password: password, // Save plain text password
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
      accountType: 'customer'
    });

    // Save to MongoDB
    await newUser.save();
    const token = generateToken(newUser);

    console.log(`User registered and saved: ${email}`);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });

  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields: email, password' 
      });
    }

    // Find user
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    console.log(`User logged in: ${email}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ 
      message: 'Error during login', 
      error: error.message 
    });
  }
});

// Get user deliveries
router.get('/:email/deliveries', async (req, res) => {
  try {
    const { email } = req.params;
    
    // For demo, return sample delivery data
    const deliveryData = {
      orderId: `ORD${Date.now()}`,
      status: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      trackingNumber: `TRK${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
      currentLocation: 'Distribution Center, New York',
      updates: [
        {
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          status: 'processing',
          location: 'Warehouse',
          description: 'Order received and processing started'
        },
        {
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          status: 'shipped',
          location: 'Warehouse',
          description: 'Package shipped from warehouse'
        },
        {
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          status: 'in_transit',
          location: 'Distribution Center, New York',
          description: 'Package arrived at distribution center'
        }
      ],
      orderDetails: {
        items: [
          {
            name: 'Elsa Fashion Designer Dress',
            quantity: 1,
            price: 299.99
          },
          {
            name: 'Elsa Fashion Handbag',
            quantity: 1,
              price: 149.99
            }
          ],
          total: 449.98,
          orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      };

    res.json(deliveryData);

  } catch (error) {
    console.error('Get deliveries error:', error);
    res.status(500).json({ 
      message: 'Error fetching deliveries', 
      error: error.message 
    });
  }
});

// Update delivery status (for demo purposes)
router.post('/:email/deliveries/update', async (req, res) => {
  try {
    const { email } = req.params;
    const { status, location, description } = req.body;
    
    // For demo, return success without actual storage
    console.log(`Delivery updated for ${email}: ${status}`);

    res.json({
      message: 'Delivery status updated successfully',
      status,
      location,
      description
    });

  } catch (error) {
    console.error('Update delivery error:', error);
    res.status(500).json({ 
      message: 'Error updating delivery', 
      error: error.message 
    });
  }
});

module.exports = router;
