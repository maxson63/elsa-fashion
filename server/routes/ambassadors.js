const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Ambassador = require('../models/Ambassador');
const router = express.Router();

// Register ambassador
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For demo, accept any email/password that's at least 6 chars
    if (!email || !password || password.length < 6) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if ambassador already exists
    const existingAmbassador = await Ambassador.findOne({ email });
    if (existingAmbassador) {
      return res.status(400).json({ message: 'Ambassador already exists' });
    }
    
    // Create ambassador object
    const ambassador = new Ambassador({
      email,
      password: password,
      isVerified: false,
      balance: 0,
      clearanceStatus: 'pending',
      clearancePaymentStatus: 'pending',
      profile: null,
      selectedOutfits: [],
      createdAt: new Date().toISOString(),
      accountType: 'ambassador'
    });
    
    // Save to MongoDB
    await ambassador.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { ambassadorId: ambassador._id, email: ambassador.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    console.log(`Ambassador registered and saved: ${email}`);
    
    res.status(201).json({
      message: 'Ambassador registered successfully',
      token,
      ambassador: {
        _id: ambassador._id,
        email: ambassador.email,
        isVerified: ambassador.isVerified,
        balance: ambassador.balance,
        clearanceStatus: ambassador.clearanceStatus
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering ambassador', error: error.message });
  }
});

// Login ambassador
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For demo, accept any email/password that's at least 6 chars
    if (!email || !password || password.length < 6) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Find ambassador in MongoDB
    const ambassador = await Ambassador.findOne({ email });
    if (!ambassador) {
      return res.status(401).json({ message: 'Ambassador not found' });
    }
    
    // Generate token
    const token = jwt.sign(
      { ambassadorId: ambassador._id, type: 'ambassador' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      ambassador: {
        id: ambassador._id,
        email: ambassador.email,
        isVerified: ambassador.isVerified,
        balance: ambassador.balance,
        clearanceStatus: ambassador.clearanceStatus
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Get ambassador profile
router.get('/profile', auth, async (req, res) => {
  try {
    const ambassador = await Ambassador.findById(req.ambassadorId);
    
    if (!ambassador) {
      return res.status(404).json({ message: 'Ambassador not found' });
    }
    
    res.json({
      id: ambassador._id,
      email: ambassador.email,
      isVerified: ambassador.isVerified,
      balance: ambassador.balance,
      clearanceStatus: ambassador.clearanceStatus,
      clearancePaymentStatus: ambassador.clearancePaymentStatus,
      profile: ambassador.profile,
      selectedOutfits: ambassador.selectedOutfits
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update ambassador profile
router.put('/profile', auth, async (req, res) => {
  try {
    const ambassador = await Ambassador.findByIdAndUpdate(
      req.ambassadorId,
      { profile: req.body },
      { new: true, runValidators: true }
    );
    
    if (!ambassador) {
      return res.status(404).json({ message: 'Ambassador not found' });
    }
    
    res.json({
      message: 'Profile updated successfully',
      profile: ambassador.profile
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
});

// Select outfits for promotion
router.post('/select-outfits', auth, async (req, res) => {
  try {
    const { outfitIds } = req.body;
    
    if (outfitIds.length !== 3) {
      return res.status(400).json({ message: 'You must select exactly 3 outfits' });
    }
    
    const ambassador = await Ambassador.findByIdAndUpdate(
      req.ambassadorId,
      { selectedOutfits: outfitIds },
      { new: true }
    ).populate('selectedOutfits');
    
    res.json({
      message: 'Outfits selected successfully',
      selectedOutfits: ambassador.selectedOutfits
    });
  } catch (error) {
    res.status(500).json({ message: 'Error selecting outfits', error: error.message });
  }
});

// Submit clearance
router.post('/submit-clearance', auth, async (req, res) => {
  try {
    const ambassador = await Ambassador.findByIdAndUpdate(
      req.ambassadorId,
      { 
        clearanceStatus: 'submitted',
        profile: req.body
      },
      { new: true }
    );
    
    if (!ambassador) {
      return res.status(404).json({ message: 'Ambassador not found' });
    }
    
    res.json({
      message: 'Clearance submitted successfully',
      clearanceStatus: ambassador.clearanceStatus
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting clearance', error: error.message });
  }
});

// Get all ambassadors (admin only)
router.get('/', async (req, res) => {
  try {
    const ambassadors = await Ambassador.find()
      .select('-password -twoFactorSecret')
      .populate('selectedOutfits');
    
    res.json(ambassadors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ambassadors', error: error.message });
  }
});

module.exports = router;
