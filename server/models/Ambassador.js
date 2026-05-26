const mongoose = require('mongoose');

const ambassadorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String
  },
  profile: {
    fullName: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    emailAddress: {
      type: String,
      required: true
    },
    socialMediaLinks: [{
      platform: {
        type: String,
        enum: ['tiktok', 'instagram', 'facebook', 'youtube', 'twitter']
      },
      handle: String,
      url: String
    }],
    audienceSize: {
      type: Number,
      required: true
    },
    contentType: {
      type: String,
      enum: ['Fashion', 'Lifestyle', 'Beauty', 'Travel', 'Fitness', 'Entertainment'],
      required: true
    },
    contentStyle: {
      type: String,
      enum: ['Luxury', 'Street Fashion', 'Casual', 'Creative', 'Elegant'],
      required: true
    },
    promotionStrategy: {
      type: String,
      required: true
    },
    previousCollaborations: {
      type: String
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    countryOfResidence: {
      type: String,
      required: true
    },
    ssn: {
      type: String,
      required: true
    },
    idCard: {
      type: String, // URL to uploaded ID card image
      required: true
    },
    contentDescription: {
      type: String,
      required: true
    }
  },
  selectedOutfits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  balance: {
    type: Number,
    default: 0.00
  },
  clearanceStatus: {
    type: String,
    enum: ['pending', 'submitted', 'approved', 'rejected'],
    default: 'pending'
  },
  clearancePaymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ambassador', ambassadorSchema);
