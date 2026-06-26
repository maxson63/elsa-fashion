const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
  ambassadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambassador',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  generatedCode: {
    type: String
  },
  generatedAt: {
    type: Date
  },
  codeExpiresAt: {
    type: Date
  },
  userEnteredCode: {
    type: String
  },
  verifiedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending_verification', 'verified', 'expired'],
    default: 'pending_verification'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VerificationCode', verificationCodeSchema);
