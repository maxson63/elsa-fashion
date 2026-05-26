const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Ambassador = require('../models/Ambassador');
const auth = require('../middleware/auth');
const router = express.Router();

// Create payment intent for customer order
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    // Calculate total amount
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        type: 'order',
        shippingAddress: JSON.stringify(shippingAddress)
      }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment intent', error: error.message });
  }
});

// Create payment intent for clearance fee
router.post('/clearance-payment', auth, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    
    // Check if ambassador has already paid
    const ambassador = await Ambassador.findById(req.ambassadorId);
    if (ambassador.clearancePaymentStatus === 'paid') {
      return res.status(400).json({ message: 'Clearance fee already paid' });
    }
    
    // Create payment intent for $2
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 200, // $2 in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        type: 'clearance',
        ambassadorId: req.ambassadorId
      }
    });
    
    if (paymentIntent.status === 'succeeded') {
      // Update ambassador payment status
      await Ambassador.findByIdAndUpdate(req.ambassadorId, {
        clearancePaymentStatus: 'paid'
      });
      
      res.json({
        message: 'Clearance payment successful',
        status: 'succeeded'
      });
    } else {
      res.json({
        message: 'Payment processing',
        status: paymentIntent.status
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing clearance payment', error: error.message });
  }
});

// Confirm payment and create order
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, customer, items, shippingAddress, paymentMethod } = req.body;
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }
    
    // Create order
    const order = new Order({
      customer,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'completed',
      paymentIntentId,
      totalAmount: items.reduce((total, item) => total + (item.price * item.quantity), 0)
    });
    
    await order.save();
    
    // Update product stock
    const Product = require('../models/Product');
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }
    
    res.json({
      message: 'Payment confirmed and order created',
      orderId: order._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming payment', error: error.message });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook signature verification failed.`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      break;
    case 'payment_intent.payment_failed':
      console.log('PaymentIntent failed!');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

module.exports = router;
