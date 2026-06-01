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
      required: false
    },
    dateOfBirth: {
      type: Date,
      required: false
    },
    phoneNumber: {
      type: String,
      required: false
    },
    emailAddress: {
      type: String,
      required: false
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
      required: false
    },
    contentType: {
      type: String,
      enum: ['Fashion', 'Lifestyle', 'Beauty', 'Travel', 'Fitness', 'Entertainment'],
      required: false
    },
    contentStyle: {
      type: String,
      enum: ['Luxury', 'Street Fashion', 'Casual', 'Creative', 'Elegant'],
      required: false
    },
    promotionStrategy: {
      type: String,
      required: false
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
      required: false
    },
    ssn: {
      type: String,
      required: false
    },
    idCard: {
      type: String, // URL to uploaded ID card image
      required: false
    },
    contentDescription: {
      type: String,
      required: false
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
