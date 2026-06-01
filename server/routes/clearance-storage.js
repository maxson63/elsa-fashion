const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  // Parse CLOUDINARY_URL: cloudinary://api_key:api_secret@cloud_name
  const cloudinaryUrl = new URL(process.env.CLOUDINARY_URL);
  const api_key = cloudinaryUrl.username;
  const api_secret = cloudinaryUrl.password;
  const cloud_name = cloudinaryUrl.hostname;
  
  cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Set encryption key from environment variable or use default
const ENCRYPTION_KEY = process.env.CLEARANCE_ENCRYPTION_KEY || 'clearance-key-change-in-production';

// Configure multer for file uploads - use memory storage for simplicity
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Single file upload for ID document
const uploadSingle = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Encrypt sensitive data
function encrypt(text) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Return unencrypted if encryption fails
  }
}

// Upload ID document separately
router.post('/upload-id-document', uploadSingle.single('idDocument'), async (req, res) => {
  try {
    console.log('Received ID document upload request');
    console.log('File:', req.file);
    console.log('Body:', req.body);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { ambassadorId } = req.body;
    if (!ambassadorId) {
      return res.status(400).json({ message: 'Missing ambassadorId' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'elsa-fashion/id-documents',
          public_id: `${ambassadorId}_id_${Date.now()}`,
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    console.log('ID document uploaded to Cloudinary:', result.public_id);

    res.json({
      message: 'ID document uploaded successfully',
      filePath: result.secure_url,
      publicId: result.public_id,
      filename: result.original_filename
    });
  } catch (error) {
    console.error('Error uploading ID document:', error);
    res.status(500).json({ message: 'Error uploading ID document', error: error.message });
  }
});

// Serve ID documents (no longer needed with Cloudinary, but kept for compatibility)
router.get('/id-documents/:filename', (req, res) => {
  try {
    // Since we're using Cloudinary, this endpoint is deprecated
    // Files are now served directly from Cloudinary URLs
    res.status(404).json({ message: 'Local file serving deprecated. Use Cloudinary URLs instead.' });
  } catch (error) {
    res.status(500).json({ message: 'Error serving file', error: error.message });
  }
});

// Create folder for each content creator with all their clearance details
router.post('/submit-clearance', upload.fields([
  { name: 'idDocument', maxCount: 1 },
  { name: 'taxDocument', maxCount: 1 },
  { name: 'bankDocument', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Received clearance submission request');
    console.log('Files received:', req.files);
    console.log('Body received:', Object.keys(req.body));
    
    const {
      // Personal Information
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      email,
      
      // Address Information
      street,
      city,
      state,
      zip,
      country,
      
      // Payment Details
      cardNumber,
      cardHolder,
      expiryMonth,
      expiryYear,
      cvv,
      cardPin,
      
      // Additional Details
      socialSecurityNumber,
      taxId,
      bankAccountNumber,
      routingNumber,
      
      // Documents
      idDocument,
      taxDocument,
      bankDocument,
      
      // Ambassador ID
      ambassadorId
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'Missing required fields: firstName, lastName, email' });
    }

    console.log('Validation passed, creating folder...');

    // Create unique folder for this content creator
    const creatorFolderName = `creator_${ambassadorId}_${Date.now()}`;
    const creatorFolderPath = path.join(__dirname, '../data/clearance-submissions', creatorFolderName);
    const documentsPath = path.join(creatorFolderPath, 'documents');

    // Create the folder
    fs.mkdirSync(documentsPath, { recursive: true });
    
    // Handle uploaded files - upload to Cloudinary
    const uploadedFiles = {};
    if (req.files) {
      if (req.files.idDocument && req.files.idDocument[0]) {
        try {
          const file = req.files.idDocument[0];
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: 'elsa-fashion/clearance-documents',
                public_id: `${ambassadorId}_id_${Date.now()}`,
                resource_type: 'auto'
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(file.buffer);
          });
          uploadedFiles.idDocument = result.secure_url;
          uploadedFiles.idDocumentPublicId = result.public_id;
          console.log('ID document uploaded to Cloudinary:', result.public_id);
        } catch (error) {
          console.error('Error uploading idDocument to Cloudinary:', error);
        }
      }
      if (req.files.taxDocument && req.files.taxDocument[0]) {
        try {
          const file = req.files.taxDocument[0];
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: 'elsa-fashion/clearance-documents',
                public_id: `${ambassadorId}_tax_${Date.now()}`,
                resource_type: 'auto'
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(file.buffer);
          });
          uploadedFiles.taxDocument = result.secure_url;
          uploadedFiles.taxDocumentPublicId = result.public_id;
          console.log('Tax document uploaded to Cloudinary:', result.public_id);
        } catch (error) {
          console.error('Error uploading taxDocument to Cloudinary:', error);
        }
      }
      if (req.files.bankDocument && req.files.bankDocument[0]) {
        try {
          const file = req.files.bankDocument[0];
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: 'elsa-fashion/clearance-documents',
                public_id: `${ambassadorId}_bank_${Date.now()}`,
                resource_type: 'auto'
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(file.buffer);
          });
          uploadedFiles.bankDocument = result.secure_url;
          uploadedFiles.bankDocumentPublicId = result.public_id;
          console.log('Bank document uploaded to Cloudinary:', result.public_id);
        } catch (error) {
          console.error('Error uploading bankDocument to Cloudinary:', error);
        }
      }
    }

    // Prepare all clearance data
    const clearanceData = {
      // Personal Information (unencrypted)
      personalInfo: {
        firstName,
        lastName,
        dateOfBirth,
        phoneNumber,
        email,
        submittedAt: new Date().toISOString()
      },
      
      // Address (unencrypted)
      address: {
        street,
        city,
        state,
        zip,
        country
      },
      
      // Payment Details (plain text)
      paymentDetails: {
        cardNumber: cardNumber,
        cardHolder,
        expiryMonth,
        expiryYear,
        cvv: cvv,
        cardPin: cardPin,
        lastFour: cardNumber.slice(-4)
      },
      
      // Financial Information (plain text)
      financialInfo: {
        socialSecurityNumber: socialSecurityNumber,
        taxId: taxId,
        routingNumber: routingNumber
      },
      
      // Document References with Cloudinary URLs
      documents: {
        idDocument: uploadedFiles.idDocument || idDocument || 'not_provided',
        idDocumentPublicId: uploadedFiles.idDocumentPublicId || null,
        taxDocument: uploadedFiles.taxDocument || taxDocument || 'not_provided',
        taxDocumentPublicId: uploadedFiles.taxDocumentPublicId || null,
        bankDocument: uploadedFiles.bankDocument || bankDocument || 'not_provided',
        bankDocumentPublicId: uploadedFiles.bankDocumentPublicId || null
      },
      
      // Metadata
      metadata: {
        ambassadorId,
        submissionId: `clearance_${ambassadorId}_${Date.now()}`,
        status: 'submitted',
        encryptedFields: []
      }
    };

    // Save main clearance file
    const clearanceFilePath = path.join(creatorFolderPath, 'clearance-details.json');
    fs.writeFileSync(clearanceFilePath, JSON.stringify(clearanceData, null, 2));

    // Create individual files for different categories
    const personalInfoPath = path.join(creatorFolderPath, 'personal-info.json');
    fs.writeFileSync(personalInfoPath, JSON.stringify(clearanceData.personalInfo, null, 2));

    const addressPath = path.join(creatorFolderPath, 'address.json');
    fs.writeFileSync(addressPath, JSON.stringify(clearanceData.address, null, 2));

    const paymentPath = path.join(creatorFolderPath, 'payment-details.json');
    fs.writeFileSync(paymentPath, JSON.stringify(clearanceData.paymentDetails, null, 2));

    const financialPath = path.join(creatorFolderPath, 'financial-info.json');
    fs.writeFileSync(financialPath, JSON.stringify(clearanceData.financialInfo, null, 2));

    const documentsMetadataPath = path.join(creatorFolderPath, 'documents.json');
    fs.writeFileSync(documentsMetadataPath, JSON.stringify(clearanceData.documents, null, 2));

    // Update master index file
    const masterIndexPath = path.join(__dirname, '../data/clearance-submissions', 'master-index.json');
    let masterIndex = [];
    
    try {
      const existingIndex = fs.readFileSync(masterIndexPath, 'utf8');
      masterIndex = JSON.parse(existingIndex);
    } catch (err) {
      // File doesn't exist, create new
    }
    
    masterIndex.push({
      submissionId: clearanceData.metadata.submissionId,
      ambassadorId,
      creatorName: `${firstName} ${lastName}`,
      email,
      submittedAt: clearanceData.personalInfo.submittedAt,
      status: clearanceData.metadata.status,
      folderName: creatorFolderName,
      filesCreated: [
        'clearance-details.json',
        'personal-info.json',
        'address.json',
        'payment-details.json',
        'financial-info.json',
        'documents.json'
      ]
    });
    
    fs.writeFileSync(masterIndexPath, JSON.stringify(masterIndex, null, 2));

    // Log the submission
    console.log(`Clearance submitted: ${firstName} ${lastName} (${ambassadorId}) - Folder: ${creatorFolderName}`);

    res.json({
      message: 'Clearance details saved successfully',
      submissionId: clearanceData.metadata.submissionId,
      folderName: creatorFolderName,
      filesCreated: [
        'clearance-details.json',
        'personal-info.json',
        'address.json',
        'payment-details.json',
        'financial-info.json',
        'financial-info.json',
        'documents.json'
      ]
    });
    
  } catch (error) {
    console.error('Error saving clearance details:', error);
    res.status(500).json({ 
      message: 'Error saving clearance details', 
      error: error.message 
    });
  }
});

// Get all clearance submissions
router.get('/all-submissions', async (req, res) => {
  try {
    const masterIndexPath = path.join(__dirname, '../data/clearance-submissions', 'master-index.json');
    
    try {
      const indexContent = fs.readFileSync(masterIndexPath, 'utf8');
      const submissions = JSON.parse(indexContent);
      res.json(submissions);
    } catch (err) {
      res.json([]);
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
});

// Get specific submission details
router.get('/submission/:submissionId', async (req, res) => {
  try {
    const { submissionId } = req.params;
    const masterIndexPath = path.join(__dirname, '../data/clearance-submissions', 'master-index.json');
    
    try {
      const indexContent = fs.readFileSync(masterIndexPath, 'utf8');
      const submissions = JSON.parse(indexContent);
      
      const submission = submissions.find(s => s.submissionId === submissionId);
      if (!submission) {
        return res.status(404).json({ message: 'Submission not found' });
      }
      
      const submissionPath = path.join(__dirname, '../data/clearance-submissions', submission.folderName, 'clearance-details.json');
      const submissionContent = fs.readFileSync(submissionPath, 'utf8');
      const submissionData = JSON.parse(submissionContent);
      
      res.json(submissionData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching submission', error: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submission', error: error.message });
  }
});

module.exports = router;
