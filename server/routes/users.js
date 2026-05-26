const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Mock user data storage
const users = [];
const userDeliveries = new Map(); // Map user email to delivery data

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
router.post('/register', (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        message: 'Missing required fields: email, password, firstName, lastName' 
      });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const userId = `user_${Date.now()}`;
    const newUser = {
      _id: userId,
      email,
      password: password, // Save plain text password
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
      accountType: 'customer'
    };

    // Save to storage folder
    const storageDir = path.join(__dirname, '../../storage/accounts');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const filePath = path.join(storageDir, `${userId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(newUser, null, 2));

    users.push(newUser);
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
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields: email, password' 
      });
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    console.log(`User logged in: ${email}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
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
router.get('/:email/deliveries', (req, res) => {
  try {
    const { email } = req.params;
    
    // Get or create delivery data for user
    let deliveryData = userDeliveries.get(email);
    
    if (!deliveryData) {
      // Create sample delivery data for demo
      deliveryData = {
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
      
      userDeliveries.set(email, deliveryData);
    }

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
router.post('/:email/deliveries/update', (req, res) => {
  try {
    const { email } = req.params;
    const { status, location, description } = req.body;
    
    let deliveryData = userDeliveries.get(email);
    if (!deliveryData) {
      return res.status(404).json({ message: 'No delivery data found for user' });
    }

    // Add new update
    deliveryData.updates.push({
      timestamp: new Date().toISOString(),
      status,
      location,
      description
    });

    // Update current status
    deliveryData.status = status;
    deliveryData.currentLocation = location;

    console.log(`Delivery updated for ${email}: ${status}`);

    res.json({
      message: 'Delivery status updated successfully',
      deliveryData
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
