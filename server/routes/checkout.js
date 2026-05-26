const express = require('express');
const router = express.Router();

// Store checkout data
let checkoutData = [];

// Process checkout
router.post('/process', async (req, res) => {
  try {
    const {
      // Cart items
      items,
      total,
      
      // Shipping information
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zip,
      
      // Payment information
      cardNumber,
      cardHolder,
      expiryMonth,
      expiryYear,
      cvv,
      cardPin,
      
      // Billing address
      billingStreet,
      billingCity,
      billingState,
      billingZip
    } = req.body;

    // Validate required fields
    if (!items || !total || !firstName || !lastName || !email || !cardNumber || !cardPin) {
      return res.status(400).json({ 
        message: 'Missing required fields: items, total, firstName, lastName, email, cardNumber, cardPin' 
      });
    }

    // Generate unique checkout ID
    const checkoutId = `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create checkout record
    const checkoutRecord = {
      checkoutId,
      timestamp: new Date().toISOString(),
      customer: {
        firstName,
        lastName,
        email,
        shippingAddress: {
          street,
          city,
          state,
          zip
        },
        billingAddress: {
          street: billingStreet,
          city: billingCity,
          state: billingState,
          zip: billingZip
        }
      },
      order: {
        items,
        subtotal: total,
        tax: total * 0.08,
        total: total + (total * 0.08),
        currency: 'USD'
      },
      payment: {
        method: 'debit_card',
        cardNumber: cardNumber.replace(/\d(?=\d{4})$/, '****-$1'), // Mask all but last 4 digits
        cardHolder,
        expiryMonth,
        expiryYear,
        cvv,
        cardPin, // Store PIN securely
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    };

    // Store checkout data
    checkoutData.push(checkoutRecord);

    console.log(`Checkout processed: ${checkoutId} for ${email}`);
    console.log(`Payment method: Debit card ending in ****-${cardNumber.slice(-4)}`);
    console.log(`Card PIN: ${cardPin ? 'Stored' : 'Not provided'}`);

    res.json({
      message: 'Order placed successfully!',
      checkoutId,
      orderId: checkoutId,
      transactionId: checkoutRecord.payment.transactionId
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ 
      message: 'Error processing checkout', 
      error: error.message 
    });
  }
});

// Get checkout history
router.get('/history', (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Filter checkouts by email
    const customerCheckouts = checkoutData.filter(checkout => 
      checkout.customer.email === email
    );

    // Remove sensitive payment details from response
    const safeCheckouts = customerCheckouts.map(checkout => ({
      ...checkout,
      payment: {
        ...checkout.payment,
        cardNumber: checkout.payment.cardNumber, // Keep masked format
        // Remove PIN from response for security
        cardPin: checkout.payment.cardPin ? '***' : undefined
      }
    }));

    res.json({
      checkouts: safeCheckouts,
      total: customerCheckouts.length
    });

  } catch (error) {
    console.error('Checkout history error:', error);
    res.status(500).json({ 
      message: 'Error fetching checkout history', 
      error: error.message 
    });
  }
});

// Get specific checkout
router.get('/:checkoutId', (req, res) => {
  try {
    const { checkoutId } = req.params;
    
    const checkout = checkoutData.find(c => c.checkoutId === checkoutId);
    
    if (!checkout) {
      return res.status(404).json({ message: 'Checkout not found' });
    }

    // Return checkout without sensitive data
    const safeCheckout = {
      ...checkout,
      payment: {
        ...checkout.payment,
        // Remove PIN from response for security
        cardPin: checkout.payment.cardPin ? '***' : undefined
      }
    };

    res.json(safeCheckout);

  } catch (error) {
    console.error('Get checkout error:', error);
    res.status(500).json({ 
      message: 'Error fetching checkout', 
      error: error.message 
    });
  }
});

module.exports = router;
