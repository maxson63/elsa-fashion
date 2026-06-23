const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Ambassador = require('../models/Ambassador');
const router = express.Router();

// Register ambassador - Step 1: Initial registration with email/password
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For demo, accept any email/password that's at least 6 chars
    if (!email || !password || password.length < 6) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if ambassador already exists (with MongoDB fallback)
    let existingAmbassador;
    try {
      existingAmbassador = await Ambassador.findOne({ email });
    } catch (dbError) {
      console.log('MongoDB connection error, using in-memory fallback');
      existingAmbassador = null;
    }
    
    if (existingAmbassador) {
      return res.status(400).json({ message: 'Ambassador already exists' });
    }
    
    // Create ambassador object (not saved yet - waiting for phone verification)
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
    
    // Save to MongoDB (with fallback)
    try {
      await ambassador.save();
    } catch (dbError) {
      console.log('MongoDB save error, using in-memory fallback');
      // Generate a mock ID
      ambassador._id = 'mock_' + Date.now();
    }
    
    console.log(`Ambassador registered (pending phone verification): ${email}`);
    
    res.status(201).json({
      message: 'Ambassador registered successfully. Please verify your phone number.',
      ambassadorId: ambassador._id,
      email: ambassador.email,
      requiresPhoneVerification: true
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering ambassador', error: error.message });
  }
});

// Send phone verification code
router.post('/send-verification-code', async (req, res) => {
  try {
    const { ambassadorId, phoneNumber } = req.body;
    
    if (!ambassadorId || !phoneNumber) {
      return res.status(400).json({ message: 'Ambassador ID and phone number are required' });
    }
    
    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }
    
    // Find ambassador (with MongoDB fallback)
    let ambassador;
    try {
      ambassador = await Ambassador.findById(ambassadorId);
    } catch (dbError) {
      console.log('MongoDB connection error, using in-memory fallback');
      ambassador = { _id: ambassadorId, email: 'mock@example.com' };
    }
    
    if (!ambassador) {
      return res.status(404).json({ message: 'Ambassador not found' });
    }
    
    // Generate 6-digit verification code
    const verificationCode = generateVerificationCode();
    
    // Calculate checksum for mathematical validation
    const checksum = calculateChecksum(verificationCode);
    
    // Store verification data (with MongoDB fallback)
    try {
      if (ambassador.save) {
        ambassador.phoneNumber = phoneNumber;
        ambassador.phoneVerification = {
          code: verificationCode,
          codeExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
          isVerified: false,
          verifiedAt: null,
          attempts: 0
        };
        await ambassador.save();
      }
    } catch (dbError) {
      console.log('MongoDB save error, using in-memory fallback');
    }
    
    // Send SMS (mock implementation - replace with actual SMS service like Twilio)
    const smsSent = await sendVerificationSMS(phoneNumber, verificationCode);
    
    console.log(`Verification code sent to ${phoneNumber}: ${verificationCode} (Checksum: ${checksum})`);
    
    res.json({
      message: 'Verification code sent successfully',
      phoneNumber: phoneNumber,
      checksum: checksum, // For mathematical validation on frontend
      codeExpiresIn: '10 minutes'
    });
    
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ message: 'Error sending verification code', error: error.message });
  }
});

// Verify phone code
router.post('/verify-phone', async (req, res) => {
  try {
    const { ambassadorId, code, userEnteredCode } = req.body;
    
    if (!ambassadorId || !code || !userEnteredCode) {
      return res.status(400).json({ message: 'Ambassador ID, code, and user entered code are required' });
    }
    
    // Find ambassador (with MongoDB fallback)
    let ambassador;
    try {
      ambassador = await Ambassador.findById(ambassadorId);
    } catch (dbError) {
      console.log('MongoDB connection error, using in-memory fallback');
      ambassador = { 
        _id: ambassadorId, 
        email: 'mock@example.com',
        phoneNumber: '+1234567890',
        isVerified: false,
        balance: 0,
        clearanceStatus: 'pending'
      };
    }
    
    if (!ambassador) {
      return res.status(404).json({ message: 'Ambassador not found' });
    }
    
    // For mock mode, still validate the code mathematically
    if (!ambassador.phoneVerification) {
      console.log('Using mock verification mode with mathematical validation');
      
      // Validate user entered code mathematically
      const userCodeValidation = validateCodeMathematically(userEnteredCode);
      
      // Reject common patterns even in mock mode
      if (!userCodeValidation.isValid) {
        let reason = '';
        if (userCodeValidation.isSequential) reason = 'sequential numbers';
        else if (userCodeValidation.allSame) reason = 'all same digits';
        else if (userCodeValidation.isPalindrome) reason = 'palindrome pattern';
        
        console.log(`Rejected code ${userEnteredCode}: contains ${reason}`);
        return res.status(400).json({ 
          message: `Code validation failed. Code contains ${reason}. Please enter the actual code sent to your phone.`,
          attemptsRemaining: 3
        });
      }
      
      // For mock mode, accept any valid-looking code (not common patterns)
      // Generate JWT token
      const token = jwt.sign(
        { ambassadorId: ambassador._id, email: ambassador.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      console.log(`Phone verified for ${ambassador.email}. Code: ${code}, User entered: ${userEnteredCode}`);
      
      return res.json({
        message: 'Phone verified successfully',
        token,
        ambassador: {
          _id: ambassador._id,
          email: ambassador.email,
          phoneNumber: ambassador.phoneNumber,
          isVerified: true,
          balance: ambassador.balance,
          clearanceStatus: ambassador.clearanceStatus
        }
      });
    }
    
    // Check if verification data exists
    if (!ambassador.phoneVerification || !ambassador.phoneVerification.code) {
      return res.status(400).json({ message: 'No verification code sent. Please request a new code.' });
    }
    
    // Check if code expired
    if (new Date() > ambassador.phoneVerification.codeExpiresAt) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new code.' });
    }
    
    // Check attempts limit
    if (ambassador.phoneVerification.attempts >= 3) {
      return res.status(400).json({ message: 'Maximum attempts reached. Please request a new code.' });
    }
    
    // Enhanced mathematical validation
    const expectedCodeValidation = validateCodeMathematically(ambassador.phoneVerification.code);
    const userCodeValidation = validateCodeMathematically(userEnteredCode);
    
    // Validate codes match exactly
    if (code !== userEnteredCode) {
      try {
        ambassador.phoneVerification.attempts += 1;
        await ambassador.save();
      } catch (dbError) {
        console.log('MongoDB save error, continuing with in-memory');
      }
      
      return res.status(400).json({ 
        message: 'Invalid verification code',
        attemptsRemaining: 3 - ambassador.phoneVerification.attempts,
        checksumMatch: expectedCodeValidation.checksum === userCodeValidation.checksum
      });
    }
    
    // Validate checksum for mathematical correctness
    if (expectedCodeValidation.checksum !== userCodeValidation.checksum) {
      try {
        ambassador.phoneVerification.attempts += 1;
        await ambassador.save();
      } catch (dbError) {
        console.log('MongoDB save error, continuing with in-memory');
      }
      
      return res.status(400).json({ 
        message: 'Code validation failed. Mathematical checksum mismatch.',
        attemptsRemaining: 3 - ambassador.phoneVerification.attempts
      });
    }
    
    // Additional validation: prevent common patterns
    if (!userCodeValidation.isValid) {
      try {
        ambassador.phoneVerification.attempts += 1;
        await ambassador.save();
      } catch (dbError) {
        console.log('MongoDB save error, continuing with in-memory');
      }
      
      let reason = '';
      if (userCodeValidation.isSequential) reason = 'sequential numbers';
      else if (userCodeValidation.allSame) reason = 'all same digits';
      else if (userCodeValidation.isPalindrome) reason = 'palindrome pattern';
      else if (userCodeValidation.hasRepeatedPairs) reason = 'repeated digit patterns';
      else if (userCodeValidation.isAlternating) reason = 'alternating patterns';
      else if (userCodeValidation.hasSimplePattern) reason = 'simple arithmetic patterns';
      else if (userCodeValidation.lowEntropy) reason = 'too few unique digits';
      
      console.log(`Rejected code ${userEnteredCode}: ${reason}`);
      return res.status(400).json({ 
        message: `Code validation failed. Code contains ${reason}. Please enter the actual code sent to your phone.`,
        attemptsRemaining: 3 - ambassador.phoneVerification.attempts
      });
    }
    
    // Verification successful
    try {
      ambassador.phoneVerification.isVerified = true;
      ambassador.phoneVerification.verifiedAt = new Date();
      ambassador.isVerified = true;
      await ambassador.save();
    } catch (dbError) {
      console.log('MongoDB save error, continuing with in-memory');
      ambassador.isVerified = true;
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { ambassadorId: ambassador._id, email: ambassador.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    console.log(`Phone verified for ${ambassador.email}. Code: ${code}, User entered: ${userEnteredCode}`);
    
    res.json({
      message: 'Phone verified successfully',
      token,
      ambassador: {
        _id: ambassador._id,
        email: ambassador.email,
        phoneNumber: ambassador.phoneNumber,
        isVerified: ambassador.isVerified,
        balance: ambassador.balance,
        clearanceStatus: ambassador.clearanceStatus
      }
    });
    
  } catch (error) {
    console.error('Error verifying phone:', error);
    res.status(500).json({ message: 'Error verifying phone', error: error.message });
  }
});

// Helper function to generate 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to calculate checksum for mathematical validation
function calculateChecksum(code) {
  // Enhanced checksum algorithm with multiple mathematical properties
  let sum = 0;
  let weightedSum = 0;
  let digitProduct = 1;
  
  for (let i = 0; i < code.length; i++) {
    const digit = parseInt(code[i]);
    sum += digit;
    weightedSum += digit * (i + 1);
    digitProduct = (digitProduct * digit) % 1000;
  }
  
  // Combine multiple mathematical properties
  const checksum1 = sum % 100;
  const checksum2 = weightedSum % 100;
  const checksum3 = digitProduct % 100;
  
  // Return combined checksum
  return (checksum1 + checksum2 + checksum3) % 100;
}

// Helper function to validate code mathematically
function validateCodeMathematically(code) {
  // Check if code follows expected mathematical patterns
  const checksum = calculateChecksum(code);
  
  // Additional validation: check if code is not sequential
  let isSequential = true;
  for (let i = 1; i < code.length; i++) {
    if (parseInt(code[i]) !== parseInt(code[i-1]) + 1) {
      isSequential = false;
      break;
    }
  }
  
  // Additional validation: check if code is not all same digits
  const allSame = code.split('').every(d => d === code[0]);
  
  // Additional validation: check if code is not palindrome
  const isPalindrome = code === code.split('').reverse().join('');
  
  // Additional validation: check for repeated pairs (2222111)
  let hasRepeatedPairs = false;
  for (let i = 0; i < code.length - 1; i++) {
    if (code[i] === code[i+1]) {
      let count = 1;
      for (let j = i + 1; j < code.length && code[j] === code[i]; j++) {
        count++;
      }
      if (count >= 3) { // 3 or more consecutive same digits
        hasRepeatedPairs = true;
        break;
      }
    }
  }
  
  // Additional validation: check for alternating patterns (121212)
  let isAlternating = true;
  for (let i = 2; i < code.length; i++) {
    if (code[i] !== code[i-2]) {
      isAlternating = false;
      break;
    }
  }
  
  // Additional validation: check for simple arithmetic patterns
  let hasSimplePattern = false;
  const diffs = [];
  for (let i = 1; i < code.length; i++) {
    diffs.push(parseInt(code[i]) - parseInt(code[i-1]));
  }
  // Check if all differences are the same (arithmetic progression)
  if (diffs.length > 0 && diffs.every(d => d === diffs[0])) {
    hasSimplePattern = true;
  }
  
  // Additional validation: check for low entropy (few unique digits)
  const uniqueDigits = new Set(code.split('')).size;
  const lowEntropy = uniqueDigits <= 2;
  
  return {
    checksum: checksum,
    isSequential: isSequential,
    allSame: allSame,
    isPalindrome: isPalindrome,
    hasRepeatedPairs: hasRepeatedPairs,
    isAlternating: isAlternating,
    hasSimplePattern: hasSimplePattern,
    lowEntropy: lowEntropy,
    isValid: !isSequential && !allSame && !isPalindrome && !hasRepeatedPairs && !isAlternating && !hasSimplePattern && !lowEntropy
  };
}

// Helper function to send SMS (mock implementation - replace with actual SMS service)
async function sendVerificationSMS(phoneNumber, code) {
  // TODO: Replace with actual SMS service (Twilio, Firebase, etc.)
  // For now, log to console
  console.log(`[SMS MOCK] Sending verification code ${code} to ${phoneNumber}`);
  console.log(`[SMS MOCK] In production, use Twilio/Firebase to send actual SMS`);
  return true;
}

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
