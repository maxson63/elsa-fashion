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
  phoneNumber: {
    type: String
  },
  phoneVerification: {
    code: {
      type: String
    },
    codeExpiresAt: {
      type: Date
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: {
      type: Date
    },
    attempts: {
      type: Number,
      default: 0
    },
    userEnteredCode: {
      type: String
    }
  },
  profile: {
    fullName: {
      type: String
    },
    dateOfBirth: {
      type: Date
    },
    phoneNumber: {
      type: String
    },
    emailAddress: {
      type: String
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
      type: Number
    },
    contentType: {
      type: String,
      enum: ['Fashion', 'Lifestyle', 'Beauty', 'Travel', 'Fitness', 'Entertainment']
    },
    contentStyle: {
      type: String,
      enum: ['Luxury', 'Street Fashion', 'Casual', 'Creative', 'Elegant']
    },
    promotionStrategy: {
      type: String
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
      type: String
    },
    ssn: {
      type: String
    },
    idCard: {
      type: String // URL to uploaded ID card image
    },
    contentDescription: {
      type: String
    }
  },
  selectedOutfits: [{
    id: String,
    name: String,
    price: Number,
    image: String,
    category: String,
    selectedAt: Date
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
